import { pathToString } from '@cosmjs/crypto';
import { toHex } from '@cosmjs/encoding';
import {
  Account,
  AccountSerializationVersion,
  LedgerAccount,
  MnemonicAccount,
  PrivateKeyAccount,
  SerializableAccount,
  SerializableLedgerAccount,
  SerializableMnemonicAccount,
  SerializablePrivateKeyAccount,
  SerializableWeb3AuthAccount,
  Web3AuthAccount,
} from 'types/account';
import { WalletType } from 'types/wallet';

export const serializeMnemonicAccount = (
  account: MnemonicAccount,
): SerializableMnemonicAccount => ({
  version: AccountSerializationVersion.Mnemonic,
  walletType: WalletType.Mnemonic,
  address: account.address,
  algo: account.algo,
  hdPath: pathToString(account.hdPath),
  pubKey: toHex(account.pubKey),
  creationDate: account.creationDate,
});

export const serializeLedgerAccount = (account: LedgerAccount): SerializableLedgerAccount => ({
  version: AccountSerializationVersion.Ledger,
  walletType: WalletType.Ledger,
  address: account.address,
  algo: account.algo,
  hdPath: pathToString(account.hdPath),
  pubKey: toHex(account.pubKey),
  ledgerAppName: account.ledgerAppName,
  creationDate: account.creationDate,
});

export const serializeWeb3AuthAccount = (
  account: Web3AuthAccount,
): SerializableWeb3AuthAccount => ({
  version: AccountSerializationVersion.Web3Auth,
  walletType: WalletType.Web3Auth,
  address: account.address,
  algo: account.algo,
  pubKey: toHex(account.pubKey),
  loginProvider: account.loginProvider,
  creationDate: account.creationDate,
});

/**
 * Function to convert a [PrivateKeyAccount] into a [SerializablePrivateKeyAccount].
 * @param account - The account to convert.
 */
export const serializePrivateKeyAuthAccount = (
  account: PrivateKeyAccount,
): SerializablePrivateKeyAccount => ({
  version: AccountSerializationVersion.PrivateKey,
  walletType: WalletType.PrivateKey,
  address: account.address,
  algo: account.algo,
  pubKey: account.pubKey,
  creationDate: account.creationDate,
});

export const serializeAccount = (account: Account): SerializableAccount => {
  switch (account.walletType) {
    case WalletType.Mnemonic:
      return serializeMnemonicAccount(account);
    case WalletType.Ledger:
      return serializeLedgerAccount(account);
    case WalletType.Web3Auth:
      return serializeWeb3AuthAccount(account);
    case WalletType.PrivateKey:
      return serializePrivateKeyAuthAccount(account);
    default:
      // @ts-ignore
      throw new Error(`invalid account type ${account.walletType}`);
  }
};

export const serializeAccounts = (
  accounts: Record<string, Account>,
): Record<string, SerializableAccount> => {
  const result: Record<string, SerializableAccount> = {};
  Object.keys(accounts).forEach(address => {
    result[address] = serializeAccount(accounts[address]);
  });
  return result;
};
