import { captureLoggedInUser } from 'lib/PostHogUtils';
import { usePostHog } from 'posthog-react-native';
import React from 'react';
import { Account } from 'types/account';

/**
 * Hook to track when the user has logged in.
 */
const useTrackLoggedInUser = () => {
  const postHog = usePostHog();

  return React.useCallback(
    (account: Account) => {
      if (!postHog) {
        return;
      }

      captureLoggedInUser(postHog, account);
    },
    [postHog],
  );
};

export default useTrackLoggedInUser;
