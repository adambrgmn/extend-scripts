const chalk = require('chalk');
const { hasFile, hasPkgProp, fakeCosmiconfig } = require('../utils');

async function main() {
  const useBuiltinConfig =
    !hasFile('.semantic-releaserc') &&
    !hasFile('semantic-release.config.js') &&
    !hasPkgProp('release');

  if (useBuiltinConfig) {
    fakeCosmiconfig(
      'semantic-release',
      require('../config/semantic-release.config'),
      'release',
    );
  }

  await require('semantic-release/cli')();
}

main().catch(err => {
  console.error(chalk.bold.red('Error: ', err.message));
  console.error(err.stack);
  process.exit(1);
});
