import { toHex } from '@cosmjs/encoding';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useActiveAccount } from '@recoil/accounts';
import { useSetting } from '@recoil/settings';
import useRemoveAccount from 'hooks/accounts/useRemoveAccount';
import useUnlockWallet from 'hooks/useUnlockWallet';
import isAccountWithPrivateKey from 'lib/AccountUtils/type';
import sleep from 'lib/sleep';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import { PASSWORD_MANIPULATION_MODE } from 'screens/PasswordManipulation/useHooks';
import { WalletWithPrivateKey } from 'types/wallet';
import useDeleteAuthToken from 'hooks/axios/useDeleteAuthToken';

/**
 * Hook that provides a function to reveal the current active user private key
 * and a flag that tells if we can show it..
 */
export const useShowPrivateKey = () => {
  const activeAccount = useActiveAccount();
  const unlockWallet = useUnlockWallet();
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const { t } = useTranslation('settings');

  const canShowPrivateKey = React.useMemo(() => {
    return activeAccount !== undefined && isAccountWithPrivateKey(activeAccount);
  }, [activeAccount]);

  const showPrivateKey = React.useCallback(async () => {
    if (activeAccount === undefined) {
      return;
    }

    if (isAccountWithPrivateKey(activeAccount)) {
      const wallet = await unlockWallet(undefined, undefined, {
        titleLabelOverride: t('reveal private key title unlock'),
        subtitleLabelOverride: t('reveal private key subtitle unlock'),
        optionalBodyText: t('reveal private key body unlock'),
      });
      if (wallet.isOk()) {
        const hexEncodedPrivateKey = toHex((<WalletWithPrivateKey>wallet.value).privateKey);
        navigator.navigate(ROUTES.SETTINGS_SHOW_PRIVATE_KEY, {
          hexEncodedPrivateKey,
        });
      }
    }
  }, [activeAccount, navigator, t, unlockWallet]);

  return {
    canShowPrivateKey,
    showPrivateKey,
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
  const [biometricsError] = React.useState<string>();
  const [biometricsSupported] = React.useState(true);
  return {
    biometricsSupported,
    biometricsEnabled: biometricsSetting,
    biometricsError,
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
  const [signOutLoading, setSignOutLoading] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const activeAccount = useActiveAccount();
  const deleteAuthToken = useDeleteAuthToken();
  const removeAccount = useRemoveAccount();

  const signOut = React.useCallback(async () => {
    setSignOutLoading(true);
    await sleep(1000);
    deleteAuthToken();
    await removeAccount(activeAccount?.address!);
    navigation.reset({
      index: 0,
      routes: [
        {
          name: ROUTES.LANDING,
        },
      ],
    });
    setSignOutLoading(false);
  }, [activeAccount?.address, deleteAuthToken, navigation, removeAccount]);
  return {
    signOutLoading,
    signOut,
  };
};
