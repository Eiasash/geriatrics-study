module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/libraries/**',
    '!**/content/**',
    '!**/temp/**',
    '!**/uploads/**',
    '!jest.config.js',
    '!coverage/**',
    '!__mocks__/**'
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  },
  testMatch: [
    '**/__tests__/**/*.js',
    '**/*.test.js',
    '**/*.spec.js'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/libraries/',
    '/content/'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  // Ensure mocks directory is picked up for fs-extra
  moduleDirectories: ['node_modules', '.'],
  verbose: true,
  bail: false,
  errorOnDeprecated: true
};