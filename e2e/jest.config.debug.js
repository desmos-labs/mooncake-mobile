/** @type {import('@jest/types').Config.InitialOptions} */
const baseConfig = require('./jest.config.base.js');

module.exports = {
  ...baseConfig,
  testMatch: ['<rootDir>/e2e/debug/*.test.ts'],
};
