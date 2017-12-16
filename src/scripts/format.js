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
    !args.includes('--no-config') &&
    !hasFile('.prettierrc') &&
    !hasFile('prettier.config.js') &&
    !hasPkgProp('prettier');

  const useBuiltinIgnore =
    !args.includes('--ignore-path') &&
    !args.includes('--no-ignore') &&
    !hasFile('.prettierignore');

  const config = useBuiltinConfig
    ? ['--config', hereRelative('../config/prettierrc.js')]
    : [];

  const ignore = useBuiltinIgnore
    ? ['--ignore-path', hereRelative('../config/prettierignore')]
    : [];

  const write = args.includes('--no-write') ? [] : ['--write'];

  const filesToApply =
    parsedArgs._.length > 0
      ? parsedArgs._.map(a => a.replace(`${process.cwd()}/`, ''))
      : ['**/*.+(js|jsx|json|less|scss|css|ts|md)'];

  const result = spawn.sync(
    resolveBin('prettier'),
    [...config, ...ignore, ...write, ...filesToApply],
    { stdio: 'inherit' },
  );

  process.exit(result.status);
}

main().catch(err => {
  console.error(chalk.bold.red('Error: ', err.message));
  console.error(err.stack);
  process.exit(1);
});
