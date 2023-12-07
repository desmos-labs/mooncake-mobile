import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useActiveAccount } from '@recoil/accounts';
import useRemoveAccount from 'hooks/accounts/useRemoveAccount';
import useDeleteAuthToken from 'hooks/axios/useDeleteAuthToken';
import isAccountWithPrivateKey from 'lib/AccountUtils/type';
import sleep from 'lib/sleep';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useState } from 'react';
import { Linking } from 'react-native';

/**
 * Hook that provides a function to reveal the current active user private key
 * and a flag that tells if we can show it..
 */
export const useShowPrivateKey = () => {
  const activeAccount = useActiveAccount();

  const canShowPrivateKey = React.useMemo(() => {
    return activeAccount !== undefined && isAccountWithPrivateKey(activeAccount);
  }, [activeAccount]);

  const showPrivateKey = React.useCallback(async () => {
    if (activeAccount === undefined) {
      // TODO: Implement this.
    }
  }, [activeAccount]);

  return {
    canShowPrivateKey,
    showPrivateKey,
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
