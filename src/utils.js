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

exports.paths = paths;
exports.pkgs = pkgs;
exports.resolveBin = resolveBin;
exports.fromRoot = fromRoot;
exports.hasFile = hasFile;
exports.hasPkgProp = hasPkgProp;
