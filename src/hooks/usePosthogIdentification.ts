import { useActiveAccountAddress } from '@recoil/accounts';
import { usePostHog } from 'posthog-react-native';
import { useActiveProfile } from '@recoil/profiles';
import { useEffect } from 'react';

/**
 * Hook that allows to identify the user on PostHog.
 */
const usePosthogIdentification = () => {
  const activeAddress = useActiveAccountAddress();
  const activeProfile = useActiveProfile();
  const posthog = usePostHog();

  useEffect(() => {
    if (!posthog) {
      return;
    }
    // If the user has an active profile, we identify them with their address and dTag
    if (activeAddress && activeProfile) {
      posthog.identify(activeAddress, {
        dTag: activeProfile.dTag,
      });
      // If the user does not have an active profile, we identify them with their address only
    } else if (activeAddress) {
      posthog.identify(activeAddress);
    }
  }, [posthog, activeAddress, activeProfile]);
};

export default usePosthogIdentification;
