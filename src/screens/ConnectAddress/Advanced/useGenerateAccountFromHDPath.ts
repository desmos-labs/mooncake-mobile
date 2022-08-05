import React from 'react';
import LocalWallet from 'lib/LocalWallet';

const useGenerateAccountFromHDPath = () => {
  const [generatedAccount, setGeneratedAccount] = React.useState<
    LocalWallet | undefined
  >();
  const [generating, setGenerating] = React.useState(false);

  const generateAccountFromHDPath = React.useCallback(
    async ({
      mnemonic,
      coin,
      change,
      account,
      addressIndex,
      prefix,
    }: {
      mnemonic: string;
      coin: number;
      change: number;
      account: number;
      addressIndex: number;
      prefix: string;
    }) => {
      setGenerating(true);

      const newWallet = await LocalWallet.fromMnemonic(mnemonic, {
        prefix,
        hdPath: {
          account,
          addressIndex,
          change,
          coinType: coin,
        },
      });

      setGeneratedAccount(newWallet);
      setGenerating(false);
    },
    [generating],
  );

  return {
    generatedAccount,
    generating,
    generateAccountFromHDPath,
  };
};

export default useGenerateAccountFromHDPath;
