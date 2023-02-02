import React from 'react';
import {AccountWithWallet} from 'types/account';

/**
 * Hooks that allows to unlock and retrieve the current user's wallet.
 */
const useUnlockWallet = () => {
  return React.useCallback(async (): Promise<AccountWithWallet> => {
    return {} as AccountWithWallet;
  }, []);
};

export default useUnlockWallet;
