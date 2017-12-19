const spawn = require('cross-spawn');
const { getPackageManagerBin } = require('../../utils');

async function publish() {
  const pm = getPackageManagerBin();
  const result = spawn.sync(pm, ['build']);
  if (result.status > 0) throw new Error('Failed building scripts');
}

module.exports = { publish };
