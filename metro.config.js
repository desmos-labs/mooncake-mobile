const { getSentryExpoConfig } = require('@sentry/react-native/metro');

module.exports = (() => {
  const config = getSentryExpoConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    transform: {
      ...transformer.transform,
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  };
  config.resolver = {
    ...resolver,
    assetExts: [...resolver.assetExts, 'md'],
  };

  return config;
})();
