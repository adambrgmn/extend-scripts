const program = require('commander');
const pkg = require('../package.json');

program.version(pkg.version);
program.command('lint').action(console.log);

program.parse(process.argv);
