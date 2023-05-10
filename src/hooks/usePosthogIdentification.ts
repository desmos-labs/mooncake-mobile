import { useActiveAccountAddress } from '@recoil/accounts';
import { usePostHog } from 'posthog-react-native';
import { useActiveProfile } from '@recoil/profiles';
import { useEffect } from 'react';
import { useGetCurrentChainInfo } from '@recoil/settings';
import { identifyPostHogUser } from 'lib/PostHog/utils';

/**
 * Hook that allows to identify the user on PostHog.
 */
const usePosthogIdentification = () => {
  const activeAddress = useActiveAccountAddress();
  const activeProfile = useActiveProfile();
  const posthog = usePostHog();
  const getChainInfo = useGetCurrentChainInfo();

  useEffect(() => {
    if (!posthog) {
      return;
    }

    identifyPostHogUser(posthog, activeAddress!, getChainInfo(), activeProfile);
  }, [posthog, activeAddress, activeProfile, getChainInfo]);
};

export default usePosthogIdentification;
