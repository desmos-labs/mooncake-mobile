import {
  AppFeatureFlags,
  DefaultPosthogFeatureFlags,
  PostHogFeatureFlags,
} from 'types/appFeatureFlags';

/**
 * Function that converts the version received from PostHog into
 * a format that the application can use.
 * @param version - The version received from PostHog that should be converted.
 */
const convertPostHogVersion = (version?: string): string => {
  if (version === undefined) {
    return '';
  }

  // Here we replace the "_" with a "." because PostHog doesn't support variant keys with the "." char.
  return version.replaceAll('_', '.');
};

/**
 * Function to convert the feature flags received from posthog into
 * a format that the application can use.
 * @param featureFlags - The feature flags received from Posthog.
 */
// eslint-disable-next-line import/prefer-default-export
export const convertPostHogFeatureFlags = (
  featureFlags: PostHogFeatureFlags | undefined,
): AppFeatureFlags => {
  const safeFeatureFlags = {
    ...DefaultPosthogFeatureFlags,
    ...featureFlags,
  };
  return {
    ...safeFeatureFlags,
    loginWithPrivateKeyOnVersion: convertPostHogVersion(
      safeFeatureFlags.loginWithPrivateKeyOnVersion,
    ),
  };
};
