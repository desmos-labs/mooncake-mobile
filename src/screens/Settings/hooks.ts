import React, { useCallback } from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import { deleteBiometricAuthorization } from 'lib/SecureStorage';
import { BiometricAuthorizations } from 'types/settings';
import ROUTES from 'navigation/routes';
import { useSetSetting, useSetting } from '@recoil/settings';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { getSupportedBiometryType } from 'react-native-keychain';
import useAddAuthorizations from 'hooks/authorizations/useAddAuthorizations';
import useRemoveAuthorizations from 'hooks/authorizations/useRemoveAuthorizations';
import useGetAuthorizationInformation from 'hooks/authorizations/useGetAuthorizationInformation';
import { getMissingAuthzPermissions, getMissingFeeGrantPermissions } from 'lib/AuthorizationsUtils';

/**
 * Hook that provides a function to give or remove to the current user the grants
 * necessary to execute operations on behalf of the user.
 * @param requiredPermissions - List of messages types to which the user needs to
 * have access to use the simplified tx broadcasting logic.
 */
export const useToggleSimplifiedTxBroadcast = (requiredPermissions: string[]) => {
  const activeAccountAddress = useActiveAccountAddress()!;
  const [state, setState] = React.useState(false);
  const { feeGrants, authzGrants, loading } = useGetAuthorizationInformation(activeAccountAddress);
  const addAuthorizations = useAddAuthorizations(activeAccountAddress);
  const removeAuthorizations = useRemoveAuthorizations(activeAccountAddress);

  React.useEffect(() => {
    if (!loading && feeGrants !== undefined && authzGrants !== undefined) {
      const missingFeeGrants = getMissingFeeGrantPermissions(requiredPermissions, feeGrants);
      const missingAuthzGrants = getMissingAuthzPermissions(requiredPermissions, authzGrants);
      setState(missingFeeGrants.length === 0 && missingAuthzGrants.length === 0);
    }
  }, [authzGrants, feeGrants, loading, requiredPermissions]);

  const toggleSimplifiedTxBroadcast = React.useCallback(async () => {
    const newState = !state;

    const result = newState
      ? await addAuthorizations(requiredPermissions)
      : await removeAuthorizations(requiredPermissions);

    // TX ok, toggle the state.
    if (result.isOk()) {
      setState(newState);
    }

    return result;
  }, [state, addAuthorizations, removeAuthorizations, requiredPermissions]);

  return {
    loading,
    toggleSimplifiedTxBroadcast,
    state,
  };
};

/**
 * Hook to enable/disable the biometrics authentication.
 */
export const useToggleBiometrics = () => {
  const biometricsSetting = useSetting('biometrics');
  const setBiometricsSetting = useSetSetting('biometrics');
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const [biometricsError, setBiometricsError] = React.useState<string>();
  const [biometricsSupported, setBiometricsSupported] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const supported = await getSupportedBiometryType();
        if (supported) {
          setBiometricsSupported(true);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const toggleBiometrics = useCallback(async () => {
    setBiometricsError(undefined);
    if (biometricsSetting) {
      const result = await deleteBiometricAuthorization(BiometricAuthorizations.UnlockWallet);
      if (result.isOk()) {
        setBiometricsSetting(false);
      } else {
        console.error('disable biometrics failed', result.error.message);
        setBiometricsError(result.error.message);
      }
    } else {
      navigator.navigate(ROUTES.SETTINGS_ENABLE_BIOMETRICS);
    }
  }, [biometricsSetting, navigator, setBiometricsSetting]);

  return {
    biometricsSupported,
    biometricsEnabled: biometricsSetting,
    biometricsError,
    toggleBiometrics,
  };
};
