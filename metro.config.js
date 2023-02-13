/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const defaultSourceExts =
  require('metro-config/src/defaults/defaults').sourceExts;

const mockSourceExts = ['e2e.js', 'e2e.jsx', 'e2e.ts', 'e2e.tsx'];

module.exports = {
  resolver: {
    sourceExts: process.env.IS_E2E
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
