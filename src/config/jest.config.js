const path = require('path');
const { hasFile, hasPkgProp, fromRoot } = require('../utils');

const here = p => path.join(__dirname, p);

const useBuiltInBabelConfig = !hasFile('.babelrc') && !hasPkgProp('babel');

const ignores = [
  '/node_modules/',
  '/fixtures/',
  '/__tests__/helpers/',
  '__mocks__',
];

const jestConfig = {
  roots: [fromRoot('src')],
  testEnvironment: 'node', // TODO create custom Extendscript environment
  collectCoverageFrom: ['src/**/*.js?(x)'],
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)(spec|test).js?(x)'],
  testPathIgnorePatterns: [...ignores],
  coveragePathIgnorePatterns: [...ignores],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};

if (useBuiltInBabelConfig) {
  jestConfig.transform = { '^.+\\.jsx?$': here('./babel-transform') };
}

module.exports = jestConfig;
