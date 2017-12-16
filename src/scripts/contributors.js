const chalk = require('chalk');
const spawn = require('cross-spawn');
const { resolveBin } = require('../utils');

async function main() {
  const [, , ...args] = process.argv;

  const result = spawn.sync(
    resolveBin('all-contributors-cli', { executable: 'all-contributors' }),
    args,
    { stdio: 'inherit' },
  );

  process.exit(result.status);
}

main().catch(err => {
  console.error(chalk.bold.red('Error: ', err.message));
  console.error(err.stack);
  process.exit(1);
});
