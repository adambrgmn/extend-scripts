const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const chalk = require('chalk');
const { spawn } = require('./utils');

const getEnv = script =>
  Object.keys(process.env)
    .filter(key => process.env[key] !== undefined)
    .reduce(
      (env, key) => ({
        ...env,
        [key]: process.env[key],
      }),
      {
        [`SCRIPTS_${script.toUpperCase()}`]: true,
      },
    );

const handleSignal = (signal, script) => {
  switch (signal) {
    case 'SIGKILL':
      console.log(
        `The script "${script}" failed because the process exited too early. This probably means the system ran out of memory or someone called "kill -9" on the process.`,
      );
      break;

    case 'SIGTERM':
      console.log(
        `The script "${script}" failed because the process exited too early. Someone might have called "kill" or "killall", or the system could be shutting down.`,
      );
      break;

    default:
    // ignore
  }

  process.exit(1);
};

const attemptResolve = (...resolveargs) => {
  try {
    const ret = require.resolve(...resolveargs);
    return ret;
  } catch (err) {
    return null;
  }
};

const spawnScript = async (executor, script, args) => {
  const relativeScriptPath = path.join(__dirname, './scripts', script);
  const scriptPath = attemptResolve(relativeScriptPath);

  if (!scriptPath) throw new Error(`Unknown script "${script}"`);

  const result = await spawn(executor, [scriptPath, ...args], {
    stdio: 'inherit',
    env: getEnv(script),
  });

  return result;
};

const printHelpMessage = async bin => {
  const scriptsPath = path.join(__dirname, 'scripts/');
  const scriptsAvailable = await glob(path.join(__dirname, 'scripts', '*'));
  const scriptsAvailableMessage = scriptsAvailable
    .map(path.normalize)
    .map(s =>
      s
        .replace(scriptsPath, '')
        .replace(/__tests__/, '')
        .replace(/\.js$/, ''),
    )
    .filter(Boolean)
    .join('\n  ')
    .trim();

  const fullMessage = `
${chalk.bold('Usage:')}
  ${chalk.yellow(bin)} [script] [--flags]

${chalk.bold('Available Scripts:')}
  ${chalk.yellow(scriptsAvailableMessage)}

${chalk.bold('Options:')}
  All options depend on the script. Docs will be improved eventually, but for
  most scripts you can assume that the args you pass will be forwarded to the
  respective tool that's being run under the hood.

  May the force be with you.
  `.trim();

  console.log(fullMessage);
};

async function main() {
  const [executor, bin, script, ...args] = process.argv;

  if (script) {
    const result = await spawnScript(executor, script, args);

    if (result.signal) handleSignal(result.signal, script);
    process.exit(result.status);
  } else {
    await printHelpMessage(bin);
  }
}

main().catch(err => {
  console.error(chalk.bold.red('Error: ', err.message));
  console.error(err.stack);
  process.exit(1);
});
