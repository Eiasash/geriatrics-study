jest.mock('fs-extra');
jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

test('build-h5p.js loads without throwing', () => {
  const buildH5p = require('../build-h5p.js');
  expect(buildH5p).toBeDefined();
  expect(typeof buildH5p).toBe('function');
});
