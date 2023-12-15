import { captureAcceptedLegalTerms } from 'lib/PostHogUtils';
import { usePostHog } from 'posthog-react-native';
import React from 'react';

/**
 * Hook that provides a function to track when
 * the user accepts the legal terms.
 */
const useTrackAcceptedLegalTerms = () => {
  const postHog = usePostHog();

  return React.useCallback(() => {
    if (!postHog) {
      return;
    }

    captureAcceptedLegalTerms(postHog);
  }, [postHog]);
};

export default useTrackAcceptedLegalTerms;
