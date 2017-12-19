const path = require('path');
const resolve = require('resolve');
const chalk = require('chalk');
const { hasFile, hasPkgProp } = require('../utils');

async function main() {
  const useBuiltinConfig =
    !hasFile('.semantic-releaserc') &&
    !hasFile('semantic-release.config.js') &&
    !hasPkgProp('release');

  const semanticPath = require.resolve('semantic-release');
  const cosmiconfigPath = resolve.sync('cosmiconfig', {
    basedir: path.dirname(semanticPath),
  });

  const realCosmiconfig = require(cosmiconfigPath);

  function fakeCosmiconfig(...args) {
    if (args[0] === 'release') {
      return {
        load() {
          return Promise.resolve({
            config: require('../config/semantic-release.config'),
          });
        },
      };
    }

    return realCosmiconfig;
  }

  if (useBuiltinConfig)
    require.cache[cosmiconfigPath] = { exports: fakeCosmiconfig };
  await require('semantic-release/cli')();
}

main().catch(err => {
  console.error(chalk.bold.red('Error: ', err.message));
  console.error(err.stack);
  process.exit(1);
});
