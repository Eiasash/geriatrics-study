jest.mock('fs-extra');
jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

test('build-h5p-mega.js loads without throwing', () => {
  const buildMega = require('../build-h5p-mega.js');
  expect(buildMega).toBeDefined();
  expect(typeof buildMega).toBe('function');
});
