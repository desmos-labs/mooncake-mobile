const {configure} = require('reassure');

configure({testingLibrary: 'react-native'});

const config = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native-community|@react-native|@react-navigation)|crypto-es',
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/jest/setupAfterEnv.js',
    '<rootDir>/jest/globalMock.js',
  ],
  setupFiles: [
    '<rootDir>/jest/setup.js',
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/assets/'],
  testPathIgnorePatterns: ['<rootDir>/e2e'],
};

module.exports = config;
