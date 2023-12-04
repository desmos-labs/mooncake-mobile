import { fromHex } from '@cosmjs/encoding';
import useSaveAccountAndCreateProfileFlow from 'hooks/accounts/useSaveAccountAndCreateProfile';
import useCustomToast from 'hooks/extended/useCustomToast';
import { generatePrivateKeyWallet } from 'lib/WalletUtils';
import { useCallback, useState } from 'react';
import { SupportedChain } from 'types/chains';

/**
 * Hook to login with a private key. (unarmed - uncrypted)
 * @param chain the chain to login to.
 */
const useLoginWithPrivateKey = (chain: SupportedChain) => {
  const startSaveAccountAndCreateProfileFlow = useSaveAccountAndCreateProfileFlow();
  const [loginLoading, setLoginLoading] = useState(false);
  const showToast = useCustomToast();

  /**
   * Function called when the user wants to log in using the private key.
   * @param prvKey the key to use.
   */
  const login = useCallback(
    async (prvKey: string) => {
      setLoginLoading(true);
      const privateKey = fromHex(prvKey);

      // Generate the wallet to check.
      const account = await generatePrivateKeyWallet(chain.prefix, privateKey);
      const result = await startSaveAccountAndCreateProfileFlow({ account });
      if (result.isErr()) {
        showToast.errorNoRetry(result.error.message);
      }
      setLoginLoading(false);
    },
    [chain.prefix, showToast, startSaveAccountAndCreateProfileFlow],
  );

  return {
    login,
    loginLoading,
  };
};

export default useLoginWithPrivateKey;
