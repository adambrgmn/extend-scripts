const path = require('path');
const chalk = require('chalk');
const yargsParser = require('yargs-parser');
const { spawn, resolveBin, hasPkgProp, hasFile } = require('../utils');

const here = p => path.join(__dirname, p);
const hereRelative = p => here(p).replace(process.cwd(), '.');

async function main() {
  const [, , ...args] = process.argv;
  const { _: files } = yargsParser(args);

  const useBuiltinConfig =
    !args.includes('--config') &&
    !args.includes('--no-eslintrc') &&
    !hasFile('.eslintrc') &&
    !hasFile('.eslintrc.js') &&
    !hasFile('.eslintrc.json') &&
    !hasPkgProp('eslintConfig');

  const useBuiltinIgnore =
    !args.includes('--ignore-path') &&
    !args.include('--no-ignore') &&
    !hasFile('.eslintignore') &&
    !hasPkgProp('eslintIgnore');

  const useCache = !args.includes('--no-cache');

  const config = useBuiltinConfig
    ? ['--config', hereRelative('../config/eslintrc.js')]
    : [];

  const ignore = useBuiltinIgnore
    ? ['--ignore-path', hereRelative('../config/eslintignore')]
    : [];

  const cache = useCache ? ['--cache'] : [];

  const filesGiven = files.length > 0;
  const filesToApply = filesGiven ? [] : ['.'];

  const result = await spawn(
    resolveBin('eslint'),
    [...config, ...ignore, ...cache, ...args, ...filesToApply],
    { stdio: 'inherit' },
  );

  process.exit(result.status);
}

main().catch(err => {
  console.error(chalk.bold.red('Error: ', err.message));
  console.error(err.stack);
  process.exit(1);
});
