import React from 'react';
import LocalWallet from 'lib/LocalWallet';

type Args = {
  /**
   * The mnemonic to generate accounts for
   */
  mnemonic: string;

  /**
   * The bech32 prefix of the generated accounts
   */
  prefix: string;

  /**
   * Optional cointype.
   * @default 852
   */
  coinType?: number;
};

/**
 * A hook that generates accounts from a mnemonic. It maintains a the state
 * of generated accounts, so it can be used on pages that require
 * dynamic account generation (i.e lists)
 */
const useGenerateAccounts = ({mnemonic, prefix, coinType = 852}: Args) => {
  const [accounts, setAccounts] = React.useState<LocalWallet[]>([]);

  const generateAccountsFromMnemonic = React.useCallback(async () => {
    const createNewWalletPromises = new Array(20)
      .fill(0)
      .map(async (_, idx) => {
        return LocalWallet.fromMnemonic(mnemonic, {
          prefix,
          hdPath: {
            coinType,
            change: 0,
            account: 0,
            addressIndex: accounts.length + idx,
          },
        });
      });

    const wallets = await Promise.all(createNewWalletPromises);

    setAccounts((prev: LocalWallet[]) => [...prev, ...wallets]);
  }, [accounts]);

  return {
    generateAccountsFromMnemonic,
    accounts,
  };
};

export default useGenerateAccounts;
