import { captureSelectedUserToFollow } from 'lib/PostHogUtils';
import { usePostHog } from 'posthog-react-native';
import React from 'react';

/**
 * Hook that provides a function to track when the user
 * has selected the creators that want to follow during the
 * onboarding process.
 */
const useTrackSelectedUsersToFollow = () => {
  const postHog = usePostHog();
  return React.useCallback(() => {
    if (!postHog) {
      return;
    }

    captureSelectedUserToFollow(postHog);
  }, [postHog]);
};

export default useTrackSelectedUsersToFollow;
