module.exports = {
  presets: [
    [
      require.resolve('babel-preset-env'),
      {
        modules: false,
      },
    ],
  ],
  plugins: [
    require.resolve('babel-plugin-external-helpers'),
    require.resolve('babel-plugin-transform-class-properties'),
    require.resolve('babel-plugin-transform-object-rest-spread'),
  ],
};
