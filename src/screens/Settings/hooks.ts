import React from 'react';
import { useActiveAccount, useActiveAccountAddress } from '@recoil/accounts';
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
import { useDeleteAuthToken } from 'services/axios';
import { PASSWORD_MANIPULATION_MODE } from 'screens/PasswordManipulation';
import { Linking } from 'react-native';
import useUnlockWallet from 'hooks/useUnlockWallet';
import isAccountWithPrivateKey from 'lib/AccountUtils/type';
import { WalletWithPrivateKey } from 'types/wallet';
import { toHex } from '@cosmjs/encoding';

/**
 * Hook that provides a function to reveal the current active user private key
 * and a flag that tells if we can show it..
 */
export const useShowPrivateKey = () => {
  const activeAccount = useActiveAccount();
  const unlockWallet = useUnlockWallet();
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  const canShowPrivateKey = React.useMemo(() => {
    return activeAccount !== undefined && isAccountWithPrivateKey(activeAccount);
  }, [activeAccount]);

  const showPrivateKey = React.useCallback(async () => {
    if (activeAccount === undefined) {
      return;
    }

    if (isAccountWithPrivateKey(activeAccount)) {
      const wallet = await unlockWallet();
      if (wallet.isOk()) {
        const hexEncodedPrivateKey = toHex((<WalletWithPrivateKey>wallet.value).privateKey);
        navigator.navigate(ROUTES.SETTINGS_SHOW_PRIVATE_KEY, {
          hexEncodedPrivateKey,
        });
      }
    }
  }, [activeAccount, navigator, unlockWallet]);

  return {
    canShowPrivateKey,
    showPrivateKey,
  };
};

export const useManageAppLinks = () => {
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  return React.useCallback(() => {
    navigator.navigate(ROUTES.MANAGE_CONNECTED_APPS);
  }, [navigator]);
};

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
 * Hook that provide a function to initiate the password change procedure.
 */
export const useChangePassword = () => {
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  return React.useCallback(async () => {
    navigator.navigate(ROUTES.PASSWORD_MANIPULATION, {
      mode: PASSWORD_MANIPULATION_MODE.CHANGE_PASSWORD,
    });
  }, [navigator]);
};

/**
 * Hook that provides a function to enable or disable the biometric
 * authentication, its current state and if the device supports the
 * biometrics.
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

  const toggleBiometrics = React.useCallback(async () => {
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

export const useOpenNotificationsSettings = () => {
  return React.useCallback(() => {
    Linking.openSettings();
  }, []);
};

/**
 * Hook that provides a function that allow the user to send us
 * a feedback about the application.
 */
export const useSendFeedback = () => {
  return React.useCallback(async () => {
    Linking.openURL('mailto:support@butter.social').catch(err =>
      console.error("Couldn't open email application", err),
    );
  }, []);
};

export const useShowAboutInfo = () => {
  return React.useCallback(() => {
    // TODO: Implement this.
    console.warn('Implement show about info');
  }, []);
};

/**
 * Hook that provide a function to sign out the current active account.
 */
export const useSignOut = () => {
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const deleteAuthToken = useDeleteAuthToken();

  return React.useCallback(() => {
    deleteAuthToken();
    // Home screen will request user to login if no bearer token is detected
    navigator.reset({
      index: 0,
      routes: [
        {
          name: ROUTES.HOME_TABS,
        },
      ],
    });
  }, [navigator, deleteAuthToken]);
};
