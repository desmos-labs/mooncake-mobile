const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  
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
