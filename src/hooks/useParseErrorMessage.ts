import { getCoinDenomByMinimalDenom } from 'lib/ChainsUtils';
import React from 'react';
import { useTranslation } from 'react-i18next';

// Regex to match the amount of tokens in an error message
const tokensAmountRegex = /.*\s(\d+)([a-z]+).*/;

/**
 * Hook to parse error messages and return a human-readable message
 */
const useParseErrorMessage = () => {
  const { t } = useTranslation('error');
  return React.useCallback(
    (error: string) => {
      // Insufficient balance errors
      const match = error.match(tokensAmountRegex);
      if (error.includes('insufficient') && match && match.length >= 3) {
        const requiredTokenAmount = parseInt(match[1], 10);
        const requiredTokenDenom = getCoinDenomByMinimalDenom(match[2]);
        return t('insufficient funds', {
          amount: `${requiredTokenAmount / 1_000_000} ${requiredTokenDenom}`,
        });
      }

      // Relationships errors
      if (error.includes('relationship')) {
        if (error.includes('already exists')) {
          return t('you are already following this user');
        } else if (error.includes('does not exist')) {
          return t('you are not following this user');
        }
      }

      // Posts errors
      if (error.includes('text exceeded max length')) {
        return t('your post is too long');
      }

      if (error) {
        // Generic error: return the error capitalizing the first letter
        return error.charAt(0).toUpperCase() + error.slice(1);
      }
      return error;
    },
    [t],
  );
};

export default useParseErrorMessage;
