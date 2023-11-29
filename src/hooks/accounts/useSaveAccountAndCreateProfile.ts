import { NavigationProp, useNavigation } from '@react-navigation/native';
import usePerformLogin from 'hooks/apis/usePerformLogin';
import useGetOnChainProfile from 'hooks/profiles/useGetOnChainProfile';
import useFetchTourGuidesState from 'hooks/tourguide/useFetchTourGuidesState';
import { promiseToResult } from 'lib/NeverThrowUtils';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { err, ok, Result } from 'neverthrow';
import React from 'react';
import { PASSWORD_MANIPULATION_MODE } from 'screens/PasswordManipulation/useHooks';
import { AccountWithWallet } from 'types/account';
import { LoginOnboardingStep } from 'types/tourguide';
import useCheckUserBalance from './useCheckUserBalance';

interface SaveAccountAndCreateProfileParams {
  account: AccountWithWallet;
  password?: string;
}

/**
 * Hook that starts the process of saving a new account on the device.
 *
 * If no <code>password</code> is provided, then the user will be taken to the screen allowing
 * them to setup their device password before storing the account on the device.
 *
 * If a <code>password<code> is provided, then the user will skip the password setup screen.
 *
 */
const useSaveAccountAndCreateProfileFlow = () => {
  const navigation = useNavigation<NavigationProp<RootNavigatorParamList>>();
  const fetchProfile = useGetOnChainProfile();
  const checkAccountBalance = useCheckUserBalance();
  const performLogin = usePerformLogin();
  const fetchTourGuidesState = useFetchTourGuidesState();

  return React.useCallback(
    async ({
      account,
      password,
    }: SaveAccountAndCreateProfileParams): Promise<Result<void, Error>> => {
      // Login the user
      const loginResult = await performLogin(account.wallet);
      if (loginResult.isErr()) {
        return err(loginResult.error);
      }

      // Get the user's profile.
      const fetchProfileResult = await promiseToResult(
        fetchProfile(account.wallet.address),
        'Unknown error while fetching the user profile',
      );
      if (fetchProfileResult.isErr()) {
        return err(fetchProfileResult.error);
      }
      const profile = fetchProfileResult.value;

      // Check if we should request the fee grant.
      const userHaveBalanceResult = await promiseToResult(
        checkAccountBalance(account.wallet.address),
        'Unknown error while checking the account balance',
      );
      if (userHaveBalanceResult.isErr()) {
        return err(userHaveBalanceResult.error);
      }
      const requestFeeGrant = !userHaveBalanceResult.value && profile === undefined;

      // Get the tour guide step
      const { login: loginTourGuideState } = await fetchTourGuidesState();

      if (requestFeeGrant) {
        navigation.navigate(ROUTES.ONBOARDING, {
          passwordManipulationMode: PASSWORD_MANIPULATION_MODE.CREATE_ACCOUNT_AND_PROFILE,
          account,
          requestFeeGrant: true,
        });
      } else if (!profile && password === undefined) {
        if (loginTourGuideState === LoginOnboardingStep.NotStarted) {
          navigation.navigate(ROUTES.ONBOARDING, {
            passwordManipulationMode: PASSWORD_MANIPULATION_MODE.SETUP_ACCOUNT_AND_CREATE_PROFILE,
            account,
          });
        } else {
          navigation.navigate(ROUTES.PASSWORD_MANIPULATION, {
            mode: PASSWORD_MANIPULATION_MODE.SETUP_ACCOUNT_AND_CREATE_PROFILE,
            account,
            profile,
          });
        }
      } else {
        if (loginTourGuideState === LoginOnboardingStep.NotStarted) {
          navigation.navigate(ROUTES.ONBOARDING, {
            passwordManipulationMode: PASSWORD_MANIPULATION_MODE.SETUP_ACCOUNT,
            account,
            profile,
          });
        } else {
          navigation.navigate(ROUTES.PASSWORD_MANIPULATION, {
            mode: PASSWORD_MANIPULATION_MODE.SETUP_ACCOUNT,
            account,
            profile,
          });
        }
      }
      return ok(undefined);
    },
    [checkAccountBalance, fetchProfile, fetchTourGuidesState, navigation, performLogin],
  );
};

export default useSaveAccountAndCreateProfileFlow;
