import { useApolloClient } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDeleteCachedAccounts, useSetActiveAccountAddress } from '@recoil/accounts';
import { useSetLoginFlowState } from '@recoil/login';
import { useResetTourGuideState } from '@recoil/tourguide';
import useDeleteAuthToken from 'hooks/axios/useDeleteAuthToken';
import useCustomToast from 'hooks/extended/useCustomToast';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { LoginFlowStep } from 'types/login';

/**
 * Hook that provides a function to logout the user from the application.
 * Logging out means:
 * 1. clearing all cached data, and
 * 2. navigating to the landing screen.
 */
const usePerformLogout = () => {
  const { reset } = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();

  const client = useApolloClient();
  const deleteToken = useDeleteAuthToken();
  const deleteCachedAccounts = useDeleteCachedAccounts();
  const setActiveAccountAddress = useSetActiveAccountAddress();
  const setLoginFlowState = useSetLoginFlowState();
  const resetTourGuideState = useResetTourGuideState();
  const toast = useCustomToast();

  return React.useCallback(async () => {
    try {
      // Clear the Apollo cache
      await client.clearStore();
    } catch (error: any) {
      toast.errorNoRetry(error.message);
    } finally {
      // We can now navigate to the landing screen while clearing up our recoils
      reset({
        index: 0,
        routes: [{ name: ROUTES.LANDING }],
      });

      // Rest the login flow state.
      setLoginFlowState({
        step: LoginFlowStep.None,
      });

      // Set the active account to undefined
      setActiveAccountAddress(undefined);

      // Clear the cached account
      deleteCachedAccounts();

      // Clear the tour guide
      resetTourGuideState();

      // Clear the token
      deleteToken();
    }
  }, [
    client,
    deleteCachedAccounts,
    deleteToken,
    reset,
    resetTourGuideState,
    setActiveAccountAddress,
    setLoginFlowState,
  ]);
};

export default usePerformLogout;
