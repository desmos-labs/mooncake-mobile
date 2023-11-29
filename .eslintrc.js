module.exports = {
  env: {
    es6: true,
    jest: true,
  },
  extends: ['airbnb', '@react-native-community'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-native', 'eslint-plugin-prettier', 'react-hooks', 'jest'],
  globals: {
    window: true,
    fetch: false,
  },
  ignorePatterns: ['**/src/screens/DEMO/**', '**/src/screens/DEV/**'],
  rules: {
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.jsx', '.tsx'],
      },
    ],
    'global-require': 0,
    'import/extensions': 0,
    'import/no-extraneous-dependencies': 0,
    'react/jsx-props-no-spreading': 0,
    'react/require-default-props': 0,
    'react/function-component-definition': 0,
    'react-native/sort-styles': 'error',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'no-unused-vars': 'off',
    'no-undef': 0,
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    // React hooks deps lints
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
      typescript: {},
    },
  },
};
