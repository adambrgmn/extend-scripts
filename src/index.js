#!/usr/bin/env node

const fransScripts = require('frans-scripts');
const pkg = require('../package.json');

const actions = {
  bundle: {
    script: require.resolve('./scripts/bundle.js'),
    config: require.resolve('./config/rollup.config.js'),
  },
  lint: {
    config: require.resolve('./config/eslint.config.js'),
  },
  release: {
    config: require.resolve('./config/semantic-release.config.js'),
  },
  contributors: {},
  format: {},
  precommit: {},
  test: {},
};

fransScripts(actions, pkg);
