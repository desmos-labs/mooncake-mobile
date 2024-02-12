import { useSetCachedFeatureFlags } from '@recoil/featureFlags';
import * as Sentry from '@sentry/react-native';
import { convertPostHogFeatureFlags } from 'lib/FeatureFlagsUtils';
import { promiseToResult } from 'lib/NeverThrowUtils';
import { usePostHog } from 'posthog-react-native';
import React from 'react';
import { PostHogFeatureFlags } from 'types/appFeatureFlags';

/**
 * Hook that provides a function to fetch the application feature flags.
 * The function returns a boolean that indicates if the feature flags
 * have been loaded.
 */
const useFetchAppFeatureFlags = () => {
  const posthog = usePostHog();
  const setAppFeatureFlags = useSetCachedFeatureFlags();

  return React.useCallback(async () => {
    if (!posthog) {
      return false;
    }

    const featureFlagsFetchResult = await promiseToResult(
      posthog.reloadFeatureFlagsAsync(),
      'Unknown error while fetching feature flags',
    );
    if (featureFlagsFetchResult.isOk()) {
      setAppFeatureFlags(
        convertPostHogFeatureFlags(posthog.getFeatureFlagPayloads() as PostHogFeatureFlags),
      );
    } else {
      Sentry.captureException(featureFlagsFetchResult.error);
    }

    return featureFlagsFetchResult.isOk();
  }, [posthog, setAppFeatureFlags]);
};

export default useFetchAppFeatureFlags;
