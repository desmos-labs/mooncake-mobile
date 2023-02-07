import React from 'react';
import { generateMnemonicWallet, randomMnemonic } from 'lib/WalletUtils';
import { DesmosHdPath } from 'config/HdPaths';

/**
 * Hook that allows to generate a new account with a wallet that is
 * generated from a random mnemonic.
 */
const useGenerateRandomAccount = () => {
  return React.useCallback(async () => {
    const mnemonic = randomMnemonic(24);
    return generateMnemonicWallet('desmos', DesmosHdPath, mnemonic);
  }, []);
};

export default useGenerateRandomAccount;
