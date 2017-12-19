const chalk = require('chalk');
const isCI = require('is-ci');
const spawn = require('cross-spawn');
const { hasPkgProp, parseEnv, hasFile, resolveBin } = require('../utils');

process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

async function main() {
  const [, , ...args] = process.argv;

  const useBuiltinConfig =
    !args.includes('--config') &&
    !hasFile('jest.config.js') &&
    !hasPkgProp('jest');

  const useWatch =
    !isCI &&
    !parseEnv('SCRIPTS_PRECOMMIT', false) &&
    !args.includes('--no-watch') &&
    !args.includes('--coverage') &&
    !args.includes('--updateSnapshot');

  const watch = useWatch ? ['--watch'] : [];

  const config = useBuiltinConfig
    ? ['--config', JSON.stringify(require('../config/jest.config'))]
    : [];

  const result = spawn.sync(
    resolveBin('jest'),
    [...config, ...watch, ...args],
    { stdio: 'inherit' },
  );

  process.exit(result.status);
}

main().catch(err => {
  console.error(chalk.bold.red('Error: ', err.message));
  console.error(err.stack);
  process.exit(1);
});
