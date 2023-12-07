import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

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
      password: Yup.string().required(t('field required', { ns: 'common' })),
    });
  }, [t]);
};
