import React from 'react';
import LocalWallet from 'lib/LocalWallet';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import {HdPath as CosmjsHdPath, Slip10RawIndex} from '@cosmjs/crypto';
import {HdPath} from 'types/hdpath';
import {LedgerSigner} from '@cosmjs/ledger-amino';

type Args = {
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

const toCosmjsHdPath = (hdPath: HdPath): CosmjsHdPath => {
  return [
    Slip10RawIndex.hardened(44),
    Slip10RawIndex.hardened(hdPath.coinType),
    Slip10RawIndex.hardened(hdPath.account),
    Slip10RawIndex.normal(hdPath.change),
    Slip10RawIndex.normal(hdPath.addressIndex),
  ];
};

/**
 * A hook that generates accounts from a mnemonic. It maintains a the state
 * of generated accounts, so it can be used on pages that require
 * dynamic account generation (i.e lists)
 */
const useGenerateAccounts = ({prefix, coinType = 852}: Args) => {
  const [accounts, setAccounts] = React.useState<any[]>([]);

  const generateAccountsFromMnemonic = React.useCallback(
    async ({mnemonic}: {mnemonic: string}) => {
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
    },
    [accounts, prefix, coinType],
  );

  const generateAccountsFromLedger = React.useCallback(
    async ({
      transport,
      ledgerApp,
    }: {
      transport: BluetoothTransport;
      ledgerApp: LedgerApp;
    }) => {
      const hdPaths: HdPath[] = new Array(20).fill(0).map((_, idx) => ({
        coinType,
        change: 0,
        account: 0,
        addressIndex: accounts.length + idx,
      }));

      const cosmJsPaths = hdPaths.map(toCosmjsHdPath);

      // let cosmosLedgerApp: LedgerApp | undefined;
      // if (ledgerApp!.name === 'Terra') {
      //   cosmosLedgerApp = new TerraLedgerApp(transport!);
      // }

      const ledgerSigner = new LedgerSigner(transport, {
        ledgerAppName: ledgerApp.name,
        minLedgerAppVersion: ledgerApp.minVersion,
        hdPaths: cosmJsPaths,
        prefix,
      });

      const _accounts = await ledgerSigner.getAccounts();

      setAccounts(prev => [
        ...prev,
        ..._accounts.map((account, index) => ({
          signer: ledgerSigner,
          hdPath: hdPaths[index],
          address: account.address,
          bech32Address: account.address,
        })),
      ]);
    },

    [accounts, prefix, coinType],
  );

  return {
    generateAccountsFromMnemonic,
    generateAccountsFromLedger,
    accounts,
  };
};

export default useGenerateAccounts;
