import { usePostHog } from 'posthog-react-native';
import React from 'react';
import useIsTestnetEvent from 'hooks/analytics/useIsTestnetEvent';
import { capturePostHogTransactionEvent } from 'lib/PostHog/utils';
import { PendingTransaction } from 'types/transactions';

/**
 * Hook that provides a function to track a transaction that has been
 * performed from the user.
 */
const useTrackTransactionPerformed = () => {
  const postHog = usePostHog();
  const isTestnetEvent = useIsTestnetEvent();

  return React.useCallback(
    async (transaction: PendingTransaction) => {
      if (!postHog || isTestnetEvent) {
        return;
      }

      capturePostHogTransactionEvent(postHog, transaction);
    },
    [postHog, isTestnetEvent],
  );
};

export default useTrackTransactionPerformed;
