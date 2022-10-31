const { compilerOptions } = require('../tsconfig');

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../pages',
  testTimeout: 60000,
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  testEnvironment: 'node',
  setupFiles: ['../test/jest-setup.ts'],
};
