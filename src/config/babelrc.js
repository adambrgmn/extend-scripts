const isTest = process.env.NODE_ENV === 'test';
const envModules = !isTest ? { modules: false } : {};
const envTargets = isTest ? { node: 'current' } : {};
const envOptions = Object.assign({}, envModules, { targets: envTargets });

module.exports = {
  presets: [
    [require.resolve('babel-preset-env'), envOptions],
    require.resolve('babel-preset-flow'),
  ],
  plugins: [
    require.resolve('babel-macros'),
    require.resolve('babel-plugin-external-helpers'),
    require.resolve('babel-plugin-transform-class-properties'),
    require.resolve('babel-plugin-transform-object-rest-spread'),
    require.resolve('babel-plugin-minify-dead-code-elimination'),
  ].filter(Boolean),
};
