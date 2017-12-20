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
const { hasFile, hasPkgProp, paths, pkgs } = require('../utils');

const here = p => path.join(__dirname, p);

const useBuiltinBabelConfig = !hasFile('.babelrc') && !hasPkgProp('babel');
const babelPresets = useBuiltinBabelConfig ? here('../config/babelrc.js') : [];

const targetEnv = process.env.TARGET_ENV;

const createConfig = input => {
  let pkgName = path.basename(input).replace(/\.jsx?$/, '');
  if (pkgName === 'index') pkgName = pkgs.project.name;

  const info = `
/**
 * ${pkgName}
 * v${pkgs.project.version}
 * Updated: ${new Date().toLocaleDateString()}
 * 
 * ${pkgs.project.description}
${pkgs.project.author &&
    ` * by ${pkgs.project.author.name} (${pkgs.project.author.email})`}
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
        externalHelpers: true,
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

module.exports = glob(path.join(paths.project, 'src/**.js?(x)'))
  .then(f => f.filter(ff => ff.includes('test')))
  .then(files => files.map(createConfig));
