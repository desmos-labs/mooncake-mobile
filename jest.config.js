const { defaults: tsjPreset } = require('ts-jest/presets');

/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
  ...tsjPreset,
  preset: 'react-native',
  transform: {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.spec.json',
      },
    ],
  },
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '@assets/(.*)': '<rootDir>/src/assets/$1',
    '@components/(.*)': '<rootDir>/src/components/$1',
    '@config/(.*)': '<rootDir>/src/config/$1',
    '@hooks/(.*)': '<rootDir>/src/hooks/$1',
    '@lib/(.*)': '<rootDir>/src/lib/$1',
    '@navigation/(.*)': '<rootDir>/src/navigation/$1',
    '@screens/(.*)': '<rootDir>/src/screens/$1',
    '@services/(.*)': '<rootDir>/src/services/$1',
    '@types/(.*)': '<rootDir>/src/types/$1',
    '@recoil/(.*)': '<rootDir>/src/recoil/$1',
  },
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/jest/globalMock.js',
  ],
  setupFiles: [
    '<rootDir>/jest/setup.js',
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native-community|@react-native|@react-navigation)|crypto-es',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/assets/'],
  testPathIgnorePatterns: ['<rootDir>/e2e'],
};
