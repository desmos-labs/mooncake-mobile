import { useActiveAccountAddress } from '@recoil/accounts';
import { useEffect } from 'react';
import useTrackUser from 'hooks/analytics/useTrackUser';

/**
 * Hook that allows to identify the user on PostHog.
 */
const usePosthogIdentification = () => {
  const activeAddress = useActiveAccountAddress();
  const trackUser = useTrackUser();

  useEffect(() => {
    trackUser(activeAddress!);
  }, [activeAddress, trackUser]);
};

export default usePosthogIdentification;
