import React from 'react';
import { useCachedFeatureFlags } from '@recoil/featureFlags';
import useFetchAppFeatureFlags from './useFetchAppFeatureFlags';

/**
 * Hook that provides the application feature flags.
 */
const useAppFeatureFlags = () => {
  const fetchFeatureFlags = useFetchAppFeatureFlags();
  const [appFeatureFlags] = useCachedFeatureFlags();

  React.useEffect(() => {
    fetchFeatureFlags();
  }, [fetchFeatureFlags]);

  return appFeatureFlags;
};

// For the time being, we disable this warning as we will surely use these function once the Landing page
// UI has been reviewed and we need to show only the private key login for the App Store review to pass
// ts-prune-ignore-next
export default useAppFeatureFlags;
