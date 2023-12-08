import { usePostHog } from 'posthog-react-native';
import React from 'react';
import useIsTestnetEvent from 'hooks/analytics/useIsTestnetEvent';
import { identifyPostHogUser } from 'lib/PostHogUtils';

/**
 * Hook that provides a function to track the user on PostHog.
 */
const useTrackUser = () => {
  const postHog = usePostHog();
  const isTestnetEvent = useIsTestnetEvent();

  return React.useCallback(
    async (address: string) => {
      if (!postHog || isTestnetEvent) {
        return;
      }

      await identifyPostHogUser(postHog, address);
    },
    [postHog, isTestnetEvent],
  );
};

export default useTrackUser;
