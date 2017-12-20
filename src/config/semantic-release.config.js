const { parseEnv } = require('../utils');

const autorelease =
  parseEnv('TRAVIS', false) &&
  process.env.TRAVIS_BRANCH === 'master' &&
  !parseEnv('TRAVIS_PULL_REQUEST', false);

module.exports = {
  branch: 'master',
  dryRun: !autorelease,
  verifyConditions: [
    '@semantic-release/condition-travis',
    '@semantic-release/github',
  ],
  getLastRelease: '@semantic-release/last-release-git-tag',
  publish: [
    'semantic-release-build',
    {
      path: '@semantic-release/github',
      assets: 'dist',
    },
  ],
};
