module.exports = {
  branch: 'master',
  verifyConditions: [
    '@semantic-release/condition-travis',
    '@semantic-release/github',
  ],
  getLastRelease: '@semantic-release/last-release-git-tag',
  publish: [
    require.resolve('./plugins/semantic-release-build.js'),
    {
      path: '@semantic-release/github',
      assets: 'dist',
    },
  ],
};
