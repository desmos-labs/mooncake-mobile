import { useApolloClient } from '@apollo/client';
import { useDeleteCachedAccounts, useSetActiveAccountAddress } from '@recoil/accounts';
import { useSetLoginFlowState } from '@recoil/login';
import { useResetTourGuideState } from '@recoil/tourguide';
import useDeleteAuthToken from 'hooks/axios/useDeleteAuthToken';
import React from 'react';
import { LoginFlowStep } from 'types/login';
import useToast from 'hooks/toasts/useToast';
import { useTranslation } from 'react-i18next';
import { ToastType } from 'config/toast/toastConfig';
import useUnregistDeviceForNotifications from 'hooks/notifications/useUnregistDeviceForNotifications';
import useResetToLanding from 'hooks/navigation/useResetToLanding';
import { deleteBiometricAuthorization, deleteWallet } from 'lib/SecureStorage';

interface LogoutParams {
  /**
   * Tells if the user should be taken to the landing screen.
   * If undefined this will default to true.
   */
  readonly resetToLanding?: boolean;
  /**
   * Tells if we should keep the auth token or if we should invalidate it and delete from the
   * device storage.
   * If undefined this will default to false.
   */
  readonly keepAuthToken?: boolean;
}

/**
 * Hook that provides a function to logout the user from the application.
 * Logging out means:
 * 1. clearing all cached data, and
 * 2. navigating to the landing screen.
 */
const usePerformLogout = () => {
  const { t } = useTranslation('common');

  const client = useApolloClient();
  const unregisterDeviceForNotifications = useUnregistDeviceForNotifications();
  const deleteToken = useDeleteAuthToken();
  const deleteCachedAccounts = useDeleteCachedAccounts();
  const setActiveAccountAddress = useSetActiveAccountAddress();
  const setLoginFlowState = useSetLoginFlowState();
  const resetTourGuideState = useResetTourGuideState();
  const showToast = useToast();
  const resetNavigationToLanding = useResetToLanding();

  return React.useCallback(
    async (logoutParams?: LogoutParams) => {
      const { resetToLanding = true, keepAuthToken = false } = logoutParams ?? {};
      try {
        // Clear the Apollo cache
        await client.clearStore();
      } catch (error: any) {
        showToast({
          toastType: ToastType.error,
          title: t('error'),
          message: error.message,
        });
      } finally {
        await unregisterDeviceForNotifications();

        if (resetToLanding) {
          resetNavigationToLanding();
        }

        // Rest the login flow state.
        setLoginFlowState({
          step: LoginFlowStep.None,
        });

        // Set the active account to undefined
        setActiveAccountAddress(undefined);

        // Clear the cached account
        const accountAddresses = deleteCachedAccounts();
        // Delete the wallet of all the accounts.
        await Promise.allSettled(accountAddresses.map(a => deleteWallet(a)));
        await deleteBiometricAuthorization(true);

        // Clear the tour guide
        resetTourGuideState();

        // Clear the token
        if (!keepAuthToken) {
          deleteToken();
        }
      }
    },
    [
      client,
      deleteCachedAccounts,
      deleteToken,
      resetNavigationToLanding,
      resetTourGuideState,
      setActiveAccountAddress,
      setLoginFlowState,
      showToast,
      t,
      unregisterDeviceForNotifications,
    ],
  );
};

export default usePerformLogout;
