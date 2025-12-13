// jest.config.js
module.exports = {
  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFiles: ['<rootDir>/tests/setup.js'],
  coveragePathIgnorePatterns: [
    '<rootDir>/server.js', // We can ignore the whole file or be more specific
  ],
  testEnvironment: 'node',
};