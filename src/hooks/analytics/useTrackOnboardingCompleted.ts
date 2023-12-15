import { captureOnboardingCompleted } from 'lib/PostHogUtils';
import { usePostHog } from 'posthog-react-native';
import React from 'react';

/**
 * Hook that provides a function to track when
 * the user has completed the onboarding.
 */
const useTrackOnboardingCompleted = () => {
  const posthog = usePostHog();

  return React.useCallback(() => {
    if (!posthog) {
      return;
    }

    captureOnboardingCompleted(posthog);
  }, [posthog]);
};

export default useTrackOnboardingCompleted;
