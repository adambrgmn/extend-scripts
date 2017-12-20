const { parseEnv } = require('../utils');
const { pkgs } = require('../utils');

const autorelease =
  parseEnv('TRAVIS', false) &&
  process.env.TRAVIS_BRANCH === 'master' &&
  !parseEnv('TRAVIS_PULL_REQUEST', false);

module.exports = {
  branch: 'master',
  dryRun: !autorelease,
  getLastRelease: '@semantic-release/last-release-git-tag',
  publish: [
    'semantic-release-build',
    {
      path: '@semantic-release/github',
      assets: [
        {
          path: 'dist/',
          name: `${pkgs.project.name}.zip`,
          label: `Download ${pkgs.project.name}`,
        },
      ],
    },
  ],
};
