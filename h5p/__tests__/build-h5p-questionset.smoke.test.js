jest.mock('fs-extra');
jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

test('build-h5p-questionset.js loads without throwing', () => {
  const buildQuestionSet = require('../build-h5p-questionset.js');
  expect(buildQuestionSet).toBeDefined();
  expect(typeof buildQuestionSet).toBe('function');
});
