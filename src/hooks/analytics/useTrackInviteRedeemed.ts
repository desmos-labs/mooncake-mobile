import { usePostHog } from 'posthog-react-native';
import React from 'react';
import useIsTestnetEvent from 'hooks/analytics/useIsTestnetEvent';
import { capturePostHogInviteRedeemEvent } from 'lib/PostHog/utils';

/**
 * Hook that provides a function to track an invite that has been redeemed
 */
const useTrackInviteRedeemed = () => {
  const postHog = usePostHog();
  const isTestnetEvent = useIsTestnetEvent();

  return React.useCallback(
    async (inviteCode: string) => {
      if (!postHog || isTestnetEvent) {
        return;
      }

      capturePostHogInviteRedeemEvent(postHog, inviteCode);
    },
    [postHog, isTestnetEvent],
  );
};

export default useTrackInviteRedeemed;
