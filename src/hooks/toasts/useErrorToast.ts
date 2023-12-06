import React from 'react';
import { useTranslation } from 'react-i18next';
import { ToastType } from 'config/toast/toastConfig';
import useToast from './useToast';

/**
 * Hook that provides a function to display an error
 * toast.
 */
const useErrorToast = () => {
  const { t } = useTranslation();
  const showToasts = useToast();

  return React.useCallback(
    (error: Error | string) => {
      const message = typeof error === 'string' ? error : error.message;
      showToasts({
        toastType: ToastType.error,
        title: t('error'),
        message,
      });
    },
    [t, showToasts],
  );
};

export default useErrorToast;
