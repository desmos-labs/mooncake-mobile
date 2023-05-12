import { usePostHog } from 'posthog-react-native';
import React from 'react';
import useIsTestnetEvent from 'hooks/analytics/useIsTestnetEvent';
import { identifyPostHogUser } from 'lib/PostHog/utils';
import { useGetCurrentChainInfo } from '@recoil/settings';

/**
 * Hook that provides a function to track the user on PostHog.
 */
const useTrackUser = () => {
  const postHog = usePostHog();
  const isTestnetEvent = useIsTestnetEvent();
  const getChainInfo = useGetCurrentChainInfo();

  return React.useCallback(
    async (address: string) => {
      if (!postHog || isTestnetEvent) {
        return;
      }

      await identifyPostHogUser(postHog, address, getChainInfo());
    },
    [postHog, isTestnetEvent, getChainInfo],
  );
};

export default useTrackUser;
