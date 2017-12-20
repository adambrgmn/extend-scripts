const spawn = require('cross-spawn');
const chalk = require('chalk');
const {
  parseEnv,
  resolveBin,
  ifScript,
  getConcurrentlyArgs,
  getPackageManagerBin,
} = require('../utils');

async function main() {
  const isPrecommit = parseEnv('SCRIPTS_PRECOMMIT', false);
  const pm = getPackageManagerBin();

  const scripts = {
    build: ifScript('build', `${pm} run build`),
    lint: isPrecommit ? null : ifScript('lint', `${pm} run lint`),
    flow: ifScript('flow', `${pm} run flow`),
    test: isPrecommit ? null : ifScript('test', `${pm} run test`),
  };

  const result = spawn.sync(
    resolveBin('concurrently'),
    getConcurrentlyArgs(scripts),
    { stdio: 'inherit' },
  );

  process.exit(result.status);
}

main().catch(err => {
  console.error(chalk.bold.red('Error: ', err.message));
  console.error(err.stack);
  process.exit(1);
});
