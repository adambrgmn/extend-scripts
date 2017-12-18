module.exports = {
  presets: [
    [
      require.resolve('babel-preset-env'),
      {
        modules: false,
      },
    ],
    require.resolve('babel-preset-flow'),
  ],
  plugins: [
    require.resolve('babel-plugin-external-helpers'),
    require.resolve('babel-plugin-transform-class-properties'),
    require.resolve('babel-plugin-transform-object-rest-spread'),
  ],
  env: {
    test: {
      presets: [
        require.resolve('babel-preset-env'),
        require.resolve('babel-preset-flow'),
      ],
    },
  },
};
