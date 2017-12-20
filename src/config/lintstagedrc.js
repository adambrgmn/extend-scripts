const { resolveScripts, resolveBin } = require('../utils');

const extendScripts = resolveScripts();

module.exports = {
  concurrent: false,
  linters: {
    'README.md': [`${resolveBin('doctoc')} --maxlevel 3 --notitle`, 'git add'],
    '.all-contributorsrc': [
      `${extendScripts} contributors generate`,
      'git add README.md',
    ],
    '**/*.+(js|jsx|json|less|scss|sass|css|ts|md)': [
      `${extendScripts} format`,
      `${extendScripts} lint`,
      `${extendScripts} test --passWithNoTests --findRelatedTests`,
      'git add',
    ],
  },
};
