import { ResultAsync } from 'neverthrow';
import { parseInt } from 'lodash';
import { promiseToResult } from 'lib/NeverThrowUtils';
import axiosInstance from 'services/axios';
import { AccountInfo } from 'types/account';
import { BondTourStep, LoginOnboardingStep } from 'types/tourguide';

/**
 * Gets the account information of the current logged user.
 */
const GetAccountInfo = (): ResultAsync<AccountInfo, Error> => {
  return promiseToResult(
    axiosInstance.get('/me').then(response => {
      const userData = response.data;
      return {
        desmosAddress: userData.desmos_address,
        creationTime: userData.creation_time,
        lastLogin: userData.last_login_time ?? undefined,
        userDeepLink: userData.user_deep_link,
        bondingDeepLink: userData.bonding_deep_link,
        loginTourLastStep: userData.app_onboarding_last_step
          ? parseInt(userData.app_onboarding_last_step, 10)
          : LoginOnboardingStep.NotStarted,
        bondTourLastStep: userData.bond_onboarding_last_step
          ? parseInt(userData.bond_onboarding_last_step, 10)
          : BondTourStep.NotStarted,
      } as AccountInfo;
    }),
    'Unknown error while getting account info',
  );
};

export default GetAccountInfo;
