import { HdPath } from '@cosmjs/crypto';
import { LedgerSigner } from '@cosmjs/ledger-amino';
import { OfflineSignerAdapter, PrivateKeySigner, SigningMode } from '@desmoslabs/desmjs';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import { slip10IndexToBaseNumber } from 'lib/FormatUtils';
import { CryptoUtils } from 'native/CryptoUtils';
import { AccountWithWallet } from 'types/account';
import { LedgerApp } from 'types/ledger';
import { WalletGenerationData, WalletType } from 'types/wallet';

/**
 * Function allowing to generate a list of [LedgerWallet].
 * @param prefix - Account prefix that should be used to generate the Bech32 address of the wallet.
 * @param hdPaths - HD paths that should be used to generate the wallet. If more than one is specified,
 * the getAccounts() method will return all the information for each account.
 * @param app - Ledger app that should be used to sign the transactions.
 * @param transport - Bluetooth Transport that should be used to connect to the Ledger device.
 */
export const generateLedgerAccountWallets = async (
  prefix: string,
  hdPaths: HdPath[],
  app: LedgerApp,
  transport: BluetoothTransport,
): Promise<AccountWithWallet[]> => {
  const signer = new OfflineSignerAdapter(
    new LedgerSigner(transport!, {
      minLedgerAppVersion: app.minVersion,
      ledgerAppName: app.name,
      prefix,
      hdPaths,
    }),
  );

  await signer.connect();
  const accounts = await signer.getAccounts();

  return accounts.map((account, i) => ({
    wallet: {
      type: WalletType.Ledger,
      address: account.address,
      publicKey: account.pubkey,
      signer,
      hdPath: hdPaths[i],
      ledgerAppName: app.name,
      addressPrefix: prefix,
    },
    account: {
      walletType: WalletType.Ledger,
      address: account.address,
      hdPath: hdPaths[i],
      algo: account.algo,
      pubKey: account.pubkey,
      ledgerAppName: app.name,
      creationDate: new Date(),
    },
  }));
};

/**
 * Function allowing to generate a MnemonicWallet.
 * @param prefix - Account prefix that should be used to generate the Bech32 address of the wallet.
 * @param hdPath - HD path that should be used to generate the wallet.
 * @param mnemonic - Mnemonic from which to generate the wallet.
 */
export const generateMnemonicWallet = async (
  prefix: string,
  hdPath: HdPath,
  mnemonic: string,
): Promise<AccountWithWallet> => {
  const [, coinType, account, change, index] = hdPath;
  const { privkey } = await CryptoUtils.deriveKeyPairFromMnemonic(
    mnemonic,
    slip10IndexToBaseNumber(coinType),
    slip10IndexToBaseNumber(account),
    slip10IndexToBaseNumber(change),
    slip10IndexToBaseNumber(index),
  );
  const signer = PrivateKeySigner.fromSecp256k1(privkey, SigningMode.DIRECT, {
    prefix,
  });
  await signer.connect();

  const [accountData] = await signer.getAccounts();

  return {
    wallet: {
      type: WalletType.Mnemonic,
      signer,
      address: accountData.address,
      hdPath,
      privateKey: signer.privateKey.key,
      publicKey: accountData.pubkey,
      addressPrefix: prefix,
    },
    account: {
      walletType: WalletType.Mnemonic,
      address: accountData.address,
      hdPath,
      algo: accountData.algo,
      pubKey: accountData.pubkey,
      creationDate: new Date(),
    },
  } as AccountWithWallet;
};

/**
 * Function allowing to generate a list of MnemonicWallet.
 * @param prefix - Account prefix that should be used to generate the Bech32 address of the wallet.
 * @param hdPaths - HD paths that should be used to generate the wallet. If more than one is specified,
 * the getAccounts() method will return all the information for each account.
 * @param mnemonic - Mnemonic from which to generate the wallet.
 */
export const generateMnemonicWallets = async (
  prefix: string,
  hdPaths: HdPath[],
  mnemonic: string,
): Promise<AccountWithWallet[]> =>
  Promise.all(hdPaths.map(async hdPath => generateMnemonicWallet(prefix, hdPath, mnemonic)));

/**
 * Function allowing to generate a Web3AuthWallet.
 * @param prefix - Account prefix that should be used to generate the Bech32 address of the wallet.
 * @param loginProvider - Login provided used from the user to obtain the private key.
 * @param privateKey - The private key obtained from Web3Auth.
 */
export const generateWeb3AuthWallet = async (
  prefix: string,
  loginProvider: string,
  privateKey: Uint8Array,
): Promise<AccountWithWallet> => {
  const signer = await PrivateKeySigner.fromSecp256k1(privateKey, SigningMode.DIRECT, {
    prefix,
  });

  await signer.connect();
  const [accountData] = await signer.getAccounts();

  return {
    wallet: {
      type: WalletType.Web3Auth,
      address: accountData.address,
      signer,
      loginProvider,
      privateKey,
      addressPrefix: prefix,
    },
    account: {
      walletType: WalletType.Web3Auth,
      address: accountData.address,
      pubKey: accountData.pubkey,
      algo: accountData.algo,
      loginProvider,
      creationDate: new Date(),
    },
  };
};

/**
 * Function allowing to generate a list of Wallet.
 * @param data - Wallet generation config.
 */
export const generateAccountWithWallets = async (
  data: WalletGenerationData,
): Promise<AccountWithWallet[]> => {
  switch (data.type) {
    case WalletType.Ledger:
      if (data.hdPaths.length === 0) {
        throw new Error('At least one HD path needs to be specified');
      }
      return generateLedgerAccountWallets(
        data.accountPrefix,
        data.hdPaths,
        data.app,
        data.transport,
      );

    case WalletType.Mnemonic:
      if (data.hdPaths.length === 0) {
        throw new Error('At least one HD path needs to be specified');
      }
      return generateMnemonicWallets(data.accountPrefix, data.hdPaths, data.mnemonic);

    case WalletType.Web3Auth: {
      const wallet = await generateWeb3AuthWallet(
        data.accountPrefix,
        data.loginProvider,
        data.privateKey,
      );
      return [wallet];
    }

    default:
      // @ts-ignore
      throw new Error(`Cannot generate wallet from HD path for import type ${data.type}`);
  }
};

/**
 * Function allowing to generate a PrivateKeyWallet.
 * @param prefix - Account prefix that should be used to generate the Bech32 address of the wallet.
 * @param privateKey - The wallet private key.
 */
export const generatePrivateKeyWallet = async (
  prefix: string,
  privateKey: Uint8Array,
): Promise<AccountWithWallet> => {
  const signer = PrivateKeySigner.fromSecp256k1(privateKey, SigningMode.DIRECT, {
    prefix,
  });

  await signer.connect();
  const [accountData] = await signer.getAccounts();

  return {
    wallet: {
      type: WalletType.PrivateKey,
      address: accountData.address,
      signer,
      privateKey,
      addressPrefix: prefix,
    },
    account: {
      walletType: WalletType.PrivateKey,
      address: accountData.address,
      pubKey: accountData.pubkey,
      algo: accountData.algo,
      creationDate: new Date(),
    },
  };
};
