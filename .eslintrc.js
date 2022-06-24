module.exports = {
  env: {
    es6: true,
    jest: true,
  },
  extends: ['airbnb', '@react-native-community'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-native'],
  globals: {
    window: true,
    fetch: false,
  },
  rules: {
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.jsx', '.tsx'],
      },
    ],
    'import/extensions': 0,
    'import/no-extraneous-dependencies': 0,
    'react/jsx-props-no-spreading': 0,
    'react-hooks/exhaustive-deps': 0,
    'react/require-default-props': 0,
    'react/function-component-definition': 0,
    'react-native/sort-styles': 'error',
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
