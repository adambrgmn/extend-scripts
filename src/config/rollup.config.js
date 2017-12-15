const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const nodeBuiltIns = require('rollup-plugin-node-builtins');
const nodeGlobals = require('rollup-plugin-node-globals');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');
const babel = require('rollup-plugin-babel');
const { hasFile, hasPkgProp, paths, pkgs } = require('../utils');

const here = p => path.join(__dirname, p);

const useBuiltinConfig = !hasFile('.babelrc') && !hasPkgProp('babel');
const babelPresets = useBuiltinConfig ? here('../config/babelrc.js') : [];

const targetEnv = process.env.TARGET_ENV;

const createConfig = input => {
  let pkgName = path.basename(input, '.js');
  if (pkgName === 'index') pkgName = pkgs.project.name;

  const banner = `${targetEnv && `// @target ${targetEnv}`}

/**
 * ${pkgName}
 * v${pkgs.project.version}
 * 
 * Creator: ${pkgs.project.author}
 */
  `;

  const config = {
    input,
    plugins: [
      nodeBuiltIns(),
      nodeGlobals(),
      resolve({ preferBuiltins: false, jsnext: true, main: true }),
      commonjs({ include: 'node_modules/**' }),
      json(),
      babel({
        externalHelpers: true,
        babelrc: true,
        exclude: 'node_modules/**',
        presets: babelPresets,
      }),
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

module.exports = glob(path.join(paths.project, 'src/*.js')).then(files =>
  files.map(createConfig),
);
