import { fromHex } from '@cosmjs/encoding';
import useSaveAccountAndCreateProfileFlow from 'hooks/accounts/useSaveAccountAndCreateProfile';
import { generatePrivateKeyWallet } from 'lib/WalletUtils';
import { useCallback, useState } from 'react';
import { SupportedChain } from 'types/chains';
import useToast from 'hooks/toasts/useToast';
import { ToastType } from 'config/toast/toastConfig';
import { useTranslation } from 'react-i18next';

/**
 * Hook to log in with an unarmored and unencrypted private key.
 * @param chain the chain to log in to.
 */
const useLoginWithPrivateKey = (chain: SupportedChain) => {
  const { t } = useTranslation('common');
  const startSaveAccountAndCreateProfileFlow = useSaveAccountAndCreateProfileFlow();
  const [loginLoading, setLoginLoading] = useState(false);
  const showToast = useToast();

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
        showToast({
          toastType: ToastType.error,
          title: t('error'),
          message: result.error.message,
        });
      }
      setLoginLoading(false);
    },
    [chain.prefix, showToast, startSaveAccountAndCreateProfileFlow, t],
  );

  return {
    login,
    loginLoading,
  };
};

export default useLoginWithPrivateKey;
