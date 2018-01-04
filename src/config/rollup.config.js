const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const nodeBuiltIns = require('rollup-plugin-node-builtins');
const nodeGlobals = require('rollup-plugin-node-globals');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');
const babel = require('rollup-plugin-babel');
const es3 = require('rollup-plugin-es3');
const { appDirectory, pkg } = require('frans-scripts/utils');

const babelPresets = require.resolve('./babel.config.js');

const targetEnv = process.env.TARGET_ENV;

const createConfig = input => {
  let pkgName = path.basename(input).replace(/\.jsx?$/, '');
  if (pkgName === 'index') pkgName = pkg.name;

  const info = `
/**
 * ${pkgName}
 * v${pkg.version}
 * Updated: ${new Date().toLocaleDateString()}
 * 
 * ${pkg.description || ''}
 * ${pkg.author ? `by ${pkg.author.name} (${pkg.author.email})` : ''}
 */
`;

  const banner = `${
    targetEnv ? `// @target ${targetEnv}\n\n` : ''
  }${info.trim()}\n`;

  const config = {
    input,
    plugins: [
      json(),
      babel({
        babelrc: true,
        exclude: 'node_modules/**',
        presets: babelPresets,
      }),
      nodeBuiltIns(),
      nodeGlobals(),
      resolve({ preferBuiltins: false, jsnext: true, main: true }),
      commonjs({ include: 'node_modules/**' }),
      es3(),
    ],
    banner,
    output: {
      file: `dist/${pkgName}.jsx`,
      format: 'iife',
      exports: 'none',
    },
  };

  return config;
};

module.exports = glob(path.join(appDirectory, 'src/**.js?(x)')).then(files =>
  files.map(createConfig),
);
