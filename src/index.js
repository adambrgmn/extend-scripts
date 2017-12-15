#!/usr/bin/env node

const { satisfies, clean } = require('semver');
const { engines } = require('../package.json');

let shouldThrow;

try {
  shouldThrow =
    require(`${process.cwd()}/package.json`).name === 'extend-scripts' &&
    !satisfies(clean(process.version), engines.node);
} catch (error) {
  // ignore
}

if (shouldThrow) {
  throw new Error(
    'You must use Node version 8 or greater to run the scripts within extend-scripts because we dogfood the untranspiled version of the scripts.',
  );
}

require('./run-scripts');
