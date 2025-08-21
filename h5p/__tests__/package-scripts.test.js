const pkg = require('../package.json');

test('package.json has required scripts', () => {
  expect(pkg.scripts).toMatchObject({
    build: expect.any(String),
    'build:qset': expect.any(String),
    'build:mega': expect.any(String),
  });
});

test('package.json has correct name', () => {
  expect(pkg.name).toBe('geriatrics-h5p');
});

test('package.json has required dev dependencies', () => {
  expect(pkg.devDependencies).toHaveProperty('jest');
  expect(pkg.devDependencies).toHaveProperty('eslint');
  expect(pkg.devDependencies).toHaveProperty('prettier');
});