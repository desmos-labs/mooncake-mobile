import { toHex } from '@cosmjs/encoding';
import {
  Account,
  AccountSerializationVersion,
  PrivateKeyAccount,
  SerializableAccount,
  SerializablePrivateKeyAccount,
  SerializableWeb3AuthAccount,
  Web3AuthAccount,
} from 'types/account';
import { WalletType } from 'types/wallet';

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
