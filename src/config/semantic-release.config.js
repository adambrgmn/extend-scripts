module.exports = {
  branch: 'master',
  verifyConditions: [
    '@semantic-release/condition-travis',
    '@semantic-release/github',
  ],
  getLastRelease: '@semantic-release/git',
  publish: [
    'semantic-release-build',
    {
      path: '@semantic-release/github',
      assets: 'dist',
    },
  ],
};
