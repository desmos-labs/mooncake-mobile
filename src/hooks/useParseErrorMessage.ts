import { useTranslation } from 'react-i18next';
import React from 'react';

const useParseErrorMessage = () => {
  const { t } = useTranslation('error');
  return React.useCallback(
    (error: string) => {
      if (error.includes('insufficient funds')) {
        return t('insufficient funds');
      }
      // Return the error capitalizing the first letter
      return error.charAt(0).toUpperCase() + error.slice(1);
    },
    [t],
  );
};

export default useParseErrorMessage;
