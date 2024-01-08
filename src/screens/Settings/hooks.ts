import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useActiveAccount } from '@recoil/accounts';
import useRemoveAccount from 'hooks/accounts/useRemoveAccount';
import useDeleteAuthToken from 'hooks/axios/useDeleteAuthToken';
import useRootNavigator from 'hooks/navigation/useRootNavigator';
import isAccountWithPrivateKey from 'lib/AccountUtils/type';
import sleep from 'lib/sleep';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import { deleteData as deleteDataIcon } from 'assets/images';
import { ButtonsLayout } from 'screens/Modals/ConfirmModal';

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

/**
 * Hook that provides a function to delete the user's data.
 */
const useDeleteData = (deleteProfile: boolean) => {
  return React.useCallback(() => {
    if (deleteProfile) {
      console.warn('TODO: Delete profile');
    } else {
      console.warn('TODO: Delete account data');
    }
  }, [deleteProfile]);
};

/**
 * Hook that provides a function to delete the user's account data.
 */
export const useDeleteAccountData = () => {
  const { t } = useTranslation('settings');
  const navigation = useRootNavigator();
  const deleteData = useDeleteData(false);

  return React.useCallback(() => {
    // Open the delete confirmation modal.
    navigation.navigate(ROUTES.CONFIRM_MODAL, {
      image: deleteDataIcon,
      title: t('delete data'),
      subtitle: t('delete account data description'),
      primaryButtonLabel: t('delete', { ns: 'common' }),
      onPressPrimary: deleteData,
      secondaryButtonLabel: t('cancel', { ns: 'common' }),
      secondaryButtonMode: 'outline',
      removeModalAfterButtonPress: true,
      buttonsLayout: ButtonsLayout.Row,
    });
  }, [deleteData, navigation, t]);
};

/**
 * Hook that provides a function to delete the user's profile.
 */
export const useDeleteProfile = () => {
  const { t } = useTranslation('settings');
  const navigation = useRootNavigator();
  const deleteData = useDeleteData(true);

  return React.useCallback(() => {
    // Open the delete confirmation modal.
    navigation.navigate(ROUTES.CONFIRM_MODAL, {
      image: deleteDataIcon,
      title: t('delete profile'),
      subtitle: t('delete profile description'),
      primaryButtonLabel: t('delete', { ns: 'common' }),
      onPressPrimary: deleteData,
      secondaryButtonLabel: t('cancel', { ns: 'common' }),
      secondaryButtonMode: 'outline',
      removeModalAfterButtonPress: true,
      buttonsLayout: ButtonsLayout.Row,
    });
  }, [deleteData, navigation, t]);
};
