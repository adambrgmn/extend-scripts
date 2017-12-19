const path = require('path');
const { hasFile, hasPkgProp } = require('../utils');

const here = p => path.join(__dirname, p);
const useBuiltInBabelConfig = !hasFile('.babelrc') && !hasPkgProp('babel');

const jestConfig = {
  roots: ['<rootDir>/src/'],
  testEnvironment: 'node', // TODO create custom Extendscript environment
  collectCoverageFrom: ['<rootDir>/src/**/*.js?(x)'],
};

if (useBuiltInBabelConfig) {
  jestConfig.transform = { '^.+\\.jsx?$': here('./babel-transform') };
}

module.exports = jestConfig;
