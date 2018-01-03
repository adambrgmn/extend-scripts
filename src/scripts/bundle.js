const { promisify } = require('util');
const rimraf = promisify(require('rimraf'));
const {
  runScript,
  hasFile,
  reformatFlags,
  resolveBin,
  fromRoot,
} = require('frans-scripts/utils');
const { has, prop, propIs } = require('ramda');

function bundle(configPath) {
  return async args => {
    const hasArg = p => has(p, args);
    const getArg = p => prop(p, args);
    const argIsString = p => propIs(String, p, args);

    const useBuiltinConfig =
      !hasArg('config') && !hasArg('c') && !hasFile('rollup.config.js');

    // eslint-disable-next-line no-nested-ternary
    const config = useBuiltinConfig
      ? ['--config', configPath]
      : (hasArg('config') && argIsString('config')) ||
        (hasArg('c') && argIsString('c'))
        ? ['--config', getArg('config') || getArg('c')]
        : ['--config'];

    const useBuiltinClean = !hasArg('clean') || getArg('clean');

    const flags = reformatFlags(args, ['config', 'clean']);

    if (useBuiltinClean) await rimraf(fromRoot('dist'));

    const bin = resolveBin('rollup');
    const commandArgs = [...config, ...flags];

    return runScript(bin, commandArgs);
  };
}

module.exports = bundle;

// const path = require('path');
// const chalk = require('chalk');
// const { promisify } = require('util');
// const rimraf = promisify(require('rimraf'));
// const yargsParser = require('yargs-parser');
// const has = require('lodash.has');
// const spawn = require('cross-spawn');
// const { hasFile, fromRoot, resolveBin } = require('../utils');

// const here = p => path.join(__dirname, p);
// const hereRelative = p => here(p).replace(process.cwd(), '.');

// async function main() {
//   const [, , ...args] = process.argv;
//   const parsedArgs = yargsParser(args);

//   const useBuiltinConfig =
//     !has(parsedArgs, 'config') &&
//     !has(parsedArgs, 'c') &&
//     !hasFile('rollup.config.js');

//   // eslint-disable-next-line no-nested-ternary
//   const config = useBuiltinConfig
//     ? ['--config', hereRelative('../config/rollup.config.js')]
//     : typeof parsedArgs.config === 'string' || typeof parsedArgs.c === 'string'
//       ? ['--config', parsedArgs.config || parsedArgs.c]
//       : ['--config'];

//   const watch =
//     has(parsedArgs, 'watch') || has(parsedArgs, 'w') ? ['--watch'] : [];

//   const env = has(parsedArgs, 'environment')
//     ? ['--environment', parsedArgs.environment]
//     : [];

//   const rollupArgs = [...config, ...env, ...watch];

//   const cleanBuildDirs = !args.includes('--no-clean');
//   if (cleanBuildDirs) {
//     await rimraf(fromRoot('dist'));
//   }

//   const result = spawn.sync(resolveBin('rollup'), rollupArgs, {
//     stdio: 'inherit',
//   });

//   process.exit(result.status);
// }

// main().catch(err => {
//   console.error(chalk.bold.red('Error: ', err.message));
//   console.error(err.stack);
//   process.exit(1);
// });
