const execa = require('execa');
const { promisify } = require('util');
const fs = require('fs');
const { pkgPath, resolveBin } = require('frans-scripts/utils');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

async function replaceVersion(newVersion, logger) {
  try {
    logger.log('Replace package.json version with new version');
    const pkg = await readFile(pkgPath);

    const newPkg = { ...JSON.parse(pkg), version: newVersion };
    await writeFile(pkgPath, JSON.stringify(newPkg, null, 2));

    return async function restoreVersion() {
      logger.log('Restoring original package.json');
      await writeFile(pkgPath, pkg);
    };
  } catch (err) {
    throw err;
  }
}

async function publish(pluginConfig, { nextRelease: { version }, logger }) {
  try {
    const restore = await replaceVersion(version, logger);

    logger.log('Running npm run build');
    await execa(resolveBin('npm'), ['run', 'build']);

    await restore();
  } catch (err) {
    throw err;
  }
}

module.exports = { publish };
