import { usePostHog } from 'posthog-react-native';
import React from 'react';
import useIsTestnetEvent from 'hooks/analytics/useIsTestnetEvent';
import { identifyPostHogUser } from 'lib/PostHog/utils';
import { useCurrentChainInfo } from '@recoil/settings';

/**
 * Hook that provides a function to track the user on PostHog.
 */
const useTrackUser = () => {
  const postHog = usePostHog();
  const isTestnetEvent = useIsTestnetEvent();
  const chainInfo = useCurrentChainInfo();

  return React.useCallback(
    async (address: string) => {
      if (!postHog || isTestnetEvent || !chainInfo) {
        return;
      }

      await identifyPostHogUser(postHog, address, chainInfo);
    },
    [postHog, isTestnetEvent, chainInfo],
  );
};

export default useTrackUser;
