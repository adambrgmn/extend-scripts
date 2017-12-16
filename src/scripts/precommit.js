const path = require('path');
const yargsParser = require('yargs-parser');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const { hasPkgProp, resolveBin, hasFile } = require('../utils');

const here = p => path.join(__dirname, p);
const hereRelative = p => here(p).replace(process.cwd(), '.');

async function main() {
  const [, , ...args] = process.argv;
  const parsedArgs = yargsParser(args);

  const useBuiltinConfig =
    !args.includes('--config') &&
    !hasFile('.lintstagedrc') &&
    !hasFile('lintstaged.config.js') &&
    !hasPkgProp('lintstaged');

  const config = useBuiltinConfig
    ? ['--config', hereRelative('../config/lintstagedrc.js')]
    : [];

  const result = spawn.sync(
    resolveBin('lint-staged'),
    [...config, ...parsedArgs._],
    { stdio: 'inherit' },
  );

  process.exit(result.status);
}

main().catch(err => {
  console.error(chalk.bold.red('Error: ', err.message));
  console.error(err.stack);
  process.exit(1);
});
