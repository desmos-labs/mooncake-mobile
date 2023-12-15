import { captureProfileSelected } from 'lib/PostHogUtils';
import { usePostHog } from 'posthog-react-native';
import React from 'react';

/**
 * Hook that provides a function to track when the user
 * selects a previously created profile.
 */
const useTrackProfileSelected = () => {
  const postHog = usePostHog();

  return React.useCallback(() => {
    if (!postHog) {
      return;
    }

    captureProfileSelected(postHog);
  }, [postHog]);
};

export default useTrackProfileSelected;
