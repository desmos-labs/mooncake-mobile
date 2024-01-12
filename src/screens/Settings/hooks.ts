import { useActiveAccount, useActiveAccountAddress } from '@recoil/accounts';
import useDeleteAuthToken from 'hooks/axios/useDeleteAuthToken';
import useRootNavigator from 'hooks/navigation/useRootNavigator';
import useResetToLanding from 'hooks/navigation/useResetToLanding';
import isAccountWithPrivateKey from 'lib/AccountUtils/type';
import sleep from 'lib/sleep';
import ROUTES from 'navigation/routes';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import { deleteData as deleteDataIcon, successfulOperation } from 'assets/images';
import { ButtonsLayout } from 'screens/Modals/ConfirmModal';
import useUnlockWallet from 'hooks/useUnlockWallet';
import DeleteUserAccount from 'services/axios/requests/DeleteUserAccount';
import usePerformLogout from 'hooks/user/usePerformLogout';
import useSignAndBroadcastTx from 'hooks/tx/useSignAndBroadcastTx';
import { Profiles } from '@desmoslabs/desmjs';
import { MsgDeleteProfile } from '@desmoslabs/desmjs-types/desmos/profiles/v3/msgs_profile';
import { Result, err, ok } from 'neverthrow';
import useLoadingModal from 'hooks/modals/useLoadingModal';
import { LoadingAnimation } from 'screens/Modals/LoadingModal';
import { Wallet } from 'types/wallet';

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
    Linking.openURL('mailto:support@butter.social').catch(error =>
      console.error("Couldn't open email application", error),
    );
  }, []);
};

export const useShowAboutInfo = () => {
  const navigation = useRootNavigator();

  return React.useCallback(() => {
    navigation.navigate(ROUTES.ABOUT);
  }, [navigation]);
};

/**
 * Hook that provide a function to sign out the current active account.
 */
export const useSignOut = () => {
  const [signOutLoading, setSignOutLoading] = useState(false);
  const performLogout = usePerformLogout();

  const signOut = React.useCallback(async () => {
    setSignOutLoading(true);
    await sleep(1000);
    await performLogout();
    setSignOutLoading(false);
  }, [performLogout]);
  return {
    signOutLoading,
    signOut,
  };
};

/**
 * Hook that provides a function to delete the user's profile.
 */
const useBroadcastDeleteProfile = () => {
  const { t } = useTranslation('settings');
  const broadcastTx = useSignAndBroadcastTx();
  const activeAccountAddress = useActiveAccountAddress();

  return React.useCallback(
    (wallet: Wallet) => {
      return new Promise<Result<void, Error>>(resolve => {
        broadcastTx(
          [
            {
              typeUrl: Profiles.v3.MsgDeleteProfileTypeUrl,
              value: MsgDeleteProfile.fromPartial({
                creator: activeAccountAddress,
              }),
            },
          ],
          {
            wallet,
            onLoading: {
              popup: {
                title: t('delete profile'),
                description: t('we are deleting your profile'),
                show: false,
              },
            },
            onSuccess: {
              popup: {
                show: false,
              },
              action: () => {
                resolve(ok(undefined));
              },
            },
            onError: {
              popup: {
                show: false,
              },
              action: error => {
                console.error(error);
                resolve(err(error));
              },
            },
          },
        );
      });
    },
    [activeAccountAddress, broadcastTx, t],
  );
};

/**
 * Hook that provides a function to delete the user's data.
 */
const useDeleteData = (deleteProfile: boolean) => {
  const { t } = useTranslation('settings');
  const navigation = useRootNavigator();
  const unlockWallet = useUnlockWallet();
  const resetToLanding = useResetToLanding();
  const performLogout = usePerformLogout();
  const deleteAuthToken = useDeleteAuthToken();
  const deleteUserProfile = useBroadcastDeleteProfile();
  const profileDeletedRef = React.useRef(false);
  const { show: showLoadingModal, hide: hideLoadingModal } = useLoadingModal();

  const showErrorMessage = React.useCallback(
    (message: string, retryAction: () => void) => {
      navigation.navigate(ROUTES.CONFIRM_MODAL, {
        title: t('error', { ns: 'common' }),
        subtitle: message,
        primaryButtonLabel: t('retry', { ns: 'common' }),
        onPressPrimary: retryAction,
      });
    },
    [navigation, t],
  );

  const deleteData = React.useCallback(async () => {
    // Request the user's password and get their wallet.
    const wallet = await unlockWallet({
      forceRequestPassword: true,
    });

    if (wallet.isOk()) {
      // The user has correctly unlocked the wallet, let's delete
      // the user's data.
      if (deleteProfile && !profileDeletedRef.current) {
        showLoadingModal({
          title: t('delete profile'),
          message: t('we are deleting your profile'),
          animation: LoadingAnimation.Dots,
        });
        const deleteProfileResult = await deleteUserProfile(wallet.value.wallet);
        hideLoadingModal();
        if (deleteProfileResult.isErr()) {
          showErrorMessage(
            t('an error occured while deleting your profile', {
              error: deleteProfileResult.error.message,
            }),
            deleteData,
          );
          return;
        }

        // Mark the profile as deleted since this function can be called another time
        // with the request to delete the user's profile.
        profileDeletedRef.current = true;
      }

      await performLogout({ resetToLanding: false, keepAuthToken: true });

      const deleteResult = await DeleteUserAccount();
      if (deleteResult.isErr()) {
        showErrorMessage(
          t('an error occured while deleting your account', {
            error: deleteResult.error.message,
          }),
          deleteData,
        );
        return;
      }
      // Let's delete the token after we have sent the delete user account request.
      deleteAuthToken();

      // Reset to landing and show the success modal.
      resetToLanding();
      navigation.navigate(ROUTES.CONFIRM_MODAL, {
        image: successfulOperation,
        title: t('success', { ns: 'common' }),
        subtitle: t('your data are going to be permanently deleted in 14 days'),
        primaryButtonLabel: t('ok', { ns: 'common' }),
        removeModalAfterButtonPress: true,
      });
    }
  }, [
    deleteAuthToken,
    deleteProfile,
    deleteUserProfile,
    hideLoadingModal,
    navigation,
    performLogout,
    resetToLanding,
    showErrorMessage,
    showLoadingModal,
    t,
    unlockWallet,
  ]);

  return deleteData;
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
