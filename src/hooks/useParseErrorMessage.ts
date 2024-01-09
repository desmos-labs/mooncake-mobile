import { useTranslation } from 'react-i18next';
import React from 'react';
import { getCoinDenomByMinimalDenom } from 'lib/ChainsUtils';

const tokensAmountRegex = /.*\s(\d+)([a-z]+).*/;

const useParseErrorMessage = () => {
  const { t } = useTranslation('error');
  return React.useCallback(
    (error: string) => {
      const match = error.match(tokensAmountRegex);
      if (error.includes('insufficient') && match && match.length >= 3) {
        const requiredTokenAmount = parseInt(match[1], 10);
        const requiredTokenDenom = getCoinDenomByMinimalDenom(match[2]);
        return t('insufficient funds', {
          amount: `${requiredTokenAmount / 1_000_000} ${requiredTokenDenom}`,
        });
      }

      if (/relationship from [a-z1-9]+ to [a-z1-9]+ already exists/.test(error)) {
        return t('you are already following this user');
      }

      if (error.includes('insufficient balance')) {
      }

      if (error) {
        // Generic error: return the error capitalizing the first letter
        return error.charAt(0).toUpperCase() + error.slice(1);
      }
    },
    [t],
  );
};

export default useParseErrorMessage;
