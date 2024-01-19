import { promiseToResult } from 'lib/NeverThrowUtils';
import axiosInstance from 'services/axios';
import { UpdatableAccountInfo as UpdatableUserData } from 'types/account';

const UpdateUserData = (userData: Partial<UpdatableUserData>) => {
  return promiseToResult(
    axiosInstance.put('/me', {
      app_onboarding_last_step: userData?.loginTourLastStep?.toString(),
      language_iso_code: userData?.languageIsoCode,
    }),
    'Unknown error while updating user data',
  );
};

export default UpdateUserData;
