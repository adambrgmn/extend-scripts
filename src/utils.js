const path = require('path');
const fs = require('fs');
const which = require('which');
const readPkgUp = require('read-pkg-up');
const arrify = require('arrify');
const has = require('lodash.has');

const { pkg: scriptPkg, path: scriptPkgPath } = readPkgUp.sync({
  cwd: __dirname,
});

const { pkg: projectPkg, path: projectPkgPath } = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd()),
});

const paths = {
  scriptPkg: scriptPkgPath,
  projectPkg: projectPkgPath,
  script: path.join(__dirname, '..'),
  project: path.dirname(projectPkgPath),
};

const pkgs = {
  script: scriptPkg,
  project: projectPkg,
};

const resolveBin = (
  modName,
  { executable = modName, cwd = process.cwd() } = {},
) => {
  let pathFromWhich;
  try {
    pathFromWhich = fs.realpathSync(which.sync(executable));
  } catch (_error) {
    // ignore _error
  }

  try {
    const modPkgPath = require.resolve(`${modName}/package.json`);
    const modPkgDir = path.dirname(modPkgPath);
    const { bin } = require(modPkgPath);
    const binPath = typeof bin === 'string' ? bin : bin[executable];
    const fullPathToBin = path.join(modPkgDir, binPath);
    if (fullPathToBin === pathFromWhich) {
      return executable;
    }
    return fullPathToBin.replace(cwd, '.');
  } catch (error) {
    if (pathFromWhich) {
      return executable;
    }
    throw error;
  }
};

const fromRoot = (...p) => path.join(paths.project, ...p);
const hasFile = (...p) => fs.existsSync(fromRoot(...p));

const hasPkgProp = props => arrify(props).some(prop => has(pkgs.project, prop));
const hasPkgSubProp = pkgProp => props =>
  hasPkgProp(arrify(props).map(p => `${pkgProp}.${p}`));
const ifPkgSubProp = pkgProp => (props, t, f) =>
  hasPkgSubProp(pkgProp)(props) ? t : f;
const ifScript = ifPkgSubProp('scripts');

const getPackageManagerBin = () => {
  try {
    resolveBin('yarn');
  } catch (err) {
    return 'npm';
  }

  if (hasFile('yarn.lock')) return 'yarn';
  return 'npm';
};

function resolveScripts() {
  if (pkgs.project.name === 'extend-scripts') {
    return require.resolve('./').replace(process.cwd(), '.');
  }
  return resolveBin('extend-scripts');
}

function envIsSet(name) {
  return (
    process.env.hasOwnProperty(name) && // eslint-disable-line
    process.env[name] &&
    process.env[name] !== 'undefined'
  );
}

function parseEnv(name, def) {
  if (envIsSet(name)) {
    return JSON.parse(process.env[name]);
  }
  return def;
}

function getConcurrentlyArgs(scripts, { killOthers = true } = {}) {
  const colors = [
    'bgBlue',
    'bgGreen',
    'bgMagenta',
    'bgCyan',
    'bgWhite',
    'bgRed',
    'bgBlack',
    'bgYellow',
  ];

  // eslint-disable-next-line
  scripts = Object.entries(scripts).reduce((all, [name, script]) => {
    if (script) {
      return Object.assign({}, all, { [name]: script });
    }
    return all;
  }, {});

  const prefixColors = Object.keys(scripts)
    .reduce(
      (pColors, _s, i) =>
        pColors.concat([`${colors[i % colors.length]}.bold.reset`]),
      [],
    )
    .join(',');

  // prettier-ignore
  return [
    killOthers ? '--kill-others-on-fail' : null,
    '--prefix', '[{name}]',
    '--names', Object.keys(scripts).join(','),
    '--prefix-colors', prefixColors,
    ...Object.values(scripts).map(s => JSON.stringify(s)), // stringify escapes quotes ✨
  ].filter(Boolean)
}

exports.paths = paths;
exports.pkgs = pkgs;
exports.resolveBin = resolveBin;
exports.fromRoot = fromRoot;
exports.hasFile = hasFile;
exports.hasPkgProp = hasPkgProp;
exports.ifScript = ifScript;
exports.getPackageManagerBin = getPackageManagerBin;
exports.resolveScripts = resolveScripts;
exports.envIsSet = envIsSet;
exports.parseEnv = parseEnv;
exports.getConcurrentlyArgs = getConcurrentlyArgs;
