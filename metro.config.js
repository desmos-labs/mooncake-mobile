/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const defaultSourceExts =
  require('metro-config/src/defaults/defaults').sourceExts;

const mockSourceExts = ['mock.js', 'mock.jsx', 'mock.ts', 'mock.tsx'];

module.exports = {
  resolver: {
    sourceExts:
      process.env.IS_E2E === 'mocked'
        ? [...mockSourceExts, ...defaultSourceExts]
        : defaultSourceExts,
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
