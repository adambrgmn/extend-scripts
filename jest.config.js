const jestConfig = require('./src/config/jest.config');

module.exports = Object.assign(jestConfig, {
  coverageThreshold: null,
  testPathIgnorePatterns: [
    '/node_modules/',
    '/fixtures/',
    '/__tests__/helpers/',
    '__mocks__',
    'src/scripts/test.js',
  ],
});
