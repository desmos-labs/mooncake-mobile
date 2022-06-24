module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          assets: './src/assets',
          components: './src/components',
          config: './src/config',
          contexts: './src/contexts',
          hooks: './src/hooks',
          lib: './src/lib',
          navigation: './src/navigation',
          screens: './src/screens',
          services: './src/services',
          types: './src/types',
          jest: './jest',
          storybook: './storybook',
        },
      },
    ],
  ],
};
