const path = require('path');
const chalk = require('chalk');
const { promisify } = require('util');
const rimraf = promisify(require('rimraf'));
const yargsParser = require('yargs-parser');
const has = require('lodash.has');
const spawn = require('cross-spawn');
const { hasFile, fromRoot, resolveBin } = require('../utils');

const here = p => path.join(__dirname, p);
const hereRelative = p => here(p).replace(process.cwd(), '.');

async function main() {
  const [, , ...args] = process.argv;
  const parsedArgs = yargsParser(args);

  const useBuiltinConfig =
    !has(parsedArgs, 'config') &&
    !has(parsedArgs, 'c') &&
    !hasFile('rollup.config.js');

  // eslint-disable-next-line no-nested-ternary
  const config = useBuiltinConfig
    ? ['--config', hereRelative('../config/rollup.config.js')]
    : typeof parsedArgs.config === 'string' || typeof parsedArgs.c === 'string'
      ? ['--config', parsedArgs.config || parsedArgs.c]
      : ['--config'];

  const watch =
    has(parsedArgs, 'watch') || has(parsedArgs, 'w') ? ['--watch'] : [];

  const env = has(parsedArgs, 'environment')
    ? ['--environment', parsedArgs.environment]
    : [];

  const rollupArgs = [...config, ...env, ...watch];

  const cleanBuildDirs = !args.includes('--no-clean');
  if (cleanBuildDirs) {
    await rimraf(fromRoot('dist'));
  }

  const result = spawn.sync(resolveBin('rollup'), rollupArgs, {
    stdio: 'inherit',
  });

  process.exit(result.status);
}

main().catch(err => {
  console.error(chalk.bold.red('Error: ', err.message));
  console.error(err.stack);
  process.exit(1);
});
