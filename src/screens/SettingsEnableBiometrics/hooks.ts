import React from 'react';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { storeBiometricAuthorization } from 'lib/SecureStorage';
import { BiometricAuthorizations } from 'types/settings';

export interface FormValues {
  readonly password: string;
}

export const useInitialFormValues = (): FormValues => ({
  password: '',
});

export const useValidationSchema = () => {
  const { t } = useTranslation('enterPassword');
  return React.useMemo(() => {
    return Yup.object().shape({
      password: Yup.string().required(t('error:required')),
    });
  }, [t]);
};

export const useEnableBiometrics = () => {
  return React.useCallback(async (password: string) => {
    // Enable the biometrics to login
    const loginResult = await storeBiometricAuthorization(BiometricAuthorizations.Login, password);
    if (loginResult.isErr()) {
      return loginResult;
    }

    // Enable the biometrics to unlock the wallet
    return storeBiometricAuthorization(BiometricAuthorizations.UnlockWallet, password);
  }, []);
};
