import React from 'react';
import { captureProfileCreated } from 'lib/PostHogUtils';
import { usePostHog } from 'posthog-react-native';

/**
 * Hook that provides a function to track when
 * the user creates a new profile.
 */
const useTrackProfileCreated = () => {
  const postHog = usePostHog();

  return React.useCallback(() => {
    if (!postHog) {
      return;
    }

    captureProfileCreated(postHog);
  }, [postHog]);
};

export default useTrackProfileCreated;
