import React from 'react';
import {AccountWithWallet} from 'types/account';

/**
 * Hook that allows to generate a new account with a wallet that is
 * generated from a random mnemonic.
 * TODO: Implement this
 */
const useGenerateRandomAccount = () => {
  return React.useCallback(async () => {
    return {} as AccountWithWallet;
  }, []);
};

export default useGenerateRandomAccount;
