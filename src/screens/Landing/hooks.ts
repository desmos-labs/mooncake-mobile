import React from 'react';
import useAppFeatureFlags from 'hooks/featureflags/useAppFeatureFlags';
import * as Application from 'expo-application';

/**
 * Hook that tells if the application should allow only login with the
 * private key.
 */
// Ignore it because in the future we might add more hooks.
// eslint-disable-next-line import/prefer-default-export
export const useIsLoginWithPrivateKeyEnabled = () => {
  const { loginWithPrivateKeyOnVersion } = useAppFeatureFlags();

  return React.useMemo(() => {
    return loginWithPrivateKeyOnVersion === Application.nativeApplicationVersion;
  }, [loginWithPrivateKeyOnVersion]);
};
