import { useActiveAccountAddress } from '@recoil/accounts';
import { usePostHog } from 'posthog-react-native';
import { useEffect } from 'react';
import { useGetCurrentChainInfo } from '@recoil/settings';
import { identifyPostHogUser } from 'lib/PostHog/utils';

/**
 * Hook that allows to identify the user on PostHog.
 */
const usePosthogIdentification = () => {
  const activeAddress = useActiveAccountAddress();
  const posthog = usePostHog();
  const getChainInfo = useGetCurrentChainInfo();

  useEffect(() => {
    if (!posthog) {
      return;
    }

    identifyPostHogUser(posthog, activeAddress!, getChainInfo());
  }, [posthog, activeAddress, getChainInfo]);
};

export default usePosthogIdentification;
