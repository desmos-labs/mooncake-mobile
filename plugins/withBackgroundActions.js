// Expo plugin for https://github.com/Rapsssito/react-native-background-actions.

const {
  AndroidConfig,
  createRunOncePlugin,
  withAndroidManifest,
  withInfoPlist,
} = require('@expo/config-plugins');

const pkg = { name: 'react-native-background-actions', version: 'UNVERSIONED' };

/**
 * Apply background actions native configuration.
 */
const withBackgroundActions = config => {
  // iOS
  // eslint-disable-next-line no-param-reassign
  config = withInfoPlist(config, newConfig => {
    if (!newConfig.modResults.BGTaskSchedulerPermittedIdentifiers) {
      // eslint-disable-next-line no-param-reassign
      newConfig.modResults.BGTaskSchedulerPermittedIdentifiers = [];
    }

    if (Array.isArray(newConfig.modResults.BGTaskSchedulerPermittedIdentifiers)) {
      newConfig.modResults.BGTaskSchedulerPermittedIdentifiers.push('$(PRODUCT_BUNDLE_IDENTIFIER)');
    }

    return newConfig;
  });

  // Android
  // eslint-disable-next-line no-param-reassign
  config = AndroidConfig.Permissions.withPermissions(config, [
    'android.permission.FOREGROUND_SERVICE',
    'android.permission.WAKE_LOCK',
  ]);

  // eslint-disable-next-line no-param-reassign
  config = withAndroidManifest(config, newConfig => {
    if (newConfig.modResults.manifest.application) {
      if (!newConfig.modResults.manifest.application[0].service) {
        // eslint-disable-next-line no-param-reassign
        newConfig.modResults.manifest.application[0].service = [];
      }

      newConfig.modResults.manifest.application[0].service.push({
        $: {
          'android:name': 'com.asterinet.react.bgactions.RNBackgroundActionsTask',
        },
      });
    }
    return newConfig;
  });

  return config;
};

module.exports = createRunOncePlugin(withBackgroundActions, pkg.name, pkg.version);
