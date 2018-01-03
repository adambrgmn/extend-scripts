import { CLIEngine } from 'eslint'; // eslint-disable-line
import baseConfig from '../eslint.config';

const cli = new CLIEngine({
  useEslintrc: false,
  baseConfig,
});

const lint = code => {
  const linter = cli.executeOnText(code);
  return linter.results[0];
};

afterEach(() => {
  jest.resetModules();
});

test('Understands extendscript globals', () => {
  const result = lint(`
    const file = new File('path/to/file');
    $.writeln(file.name);
  `);

  const filtered = result.messages.filter(m => m.fatal);
  expect(filtered.length).toBeLessThan(1);
});
