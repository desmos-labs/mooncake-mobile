import { stringToPath } from '@cosmjs/crypto/build/slip10';
import { fromHex } from '@cosmjs/encoding';
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

export const ACCOUNT_ALGOS = ['secp256k1', 'ed25519', 'sr25519'];

export const deserializeMnemonicAccount = (
  account: Partial<SerializableMnemonicAccount>,
): MnemonicAccount => {
  if (
    account.version === undefined ||
    account.address === undefined ||
    account.hdPath === undefined ||
    account.walletType === undefined ||
    account.algo === undefined ||
    account.pubKey === undefined ||
    account.creationDate === undefined
  ) {
    throw new Error('invalid mnemonic account');
  }

  if (account.version !== AccountSerializationVersion.Mnemonic) {
    throw new Error(`unsupported mnemonic account version ${account.version}`);
  }

  if (account.walletType !== WalletType.Mnemonic) {
    throw new Error(`invalid mnemonic account type ${account.walletType}`);
  }

  if (ACCOUNT_ALGOS.indexOf(account.algo) === -1) {
    throw new Error(`invalid account algo ${account.algo}`);
  }

  const hdPath = stringToPath(account.hdPath);
  const pubKey = fromHex(account.pubKey);

  return {
    walletType: WalletType.Mnemonic,
    address: account.address,
    algo: account.algo,
    hdPath,
    pubKey,
    creationDate: account.creationDate,
  };
};

export const deserializeLedgerAccount = (
  account: Partial<SerializableLedgerAccount>,
): LedgerAccount => {
  if (
    account.version === undefined ||
    account.address === undefined ||
    account.hdPath === undefined ||
    account.walletType === undefined ||
    account.algo === undefined ||
    account.pubKey === undefined ||
    account.ledgerAppName === undefined ||
    account.creationDate === undefined
  ) {
    throw new Error('invalid ledger account');
  }

  if (account.version !== AccountSerializationVersion.Ledger) {
    throw new Error(`unsupported ledger account version ${account.version}`);
  }

  if (account.walletType !== WalletType.Ledger) {
    throw new Error(`invalid ledger account type ${account.walletType}`);
  }

  if (ACCOUNT_ALGOS.indexOf(account.algo) === -1) {
    throw new Error(`invalid account algo ${account.algo}`);
  }

  const hdPath = stringToPath(account.hdPath);
  const pubKey = fromHex(account.pubKey);

  return {
    walletType: WalletType.Ledger,
    address: account.address,
    algo: account.algo,
    hdPath,
    pubKey,
    ledgerAppName: account.ledgerAppName,
    creationDate: account.creationDate,
  };
};

export const deserializeWeb3AuthAccount = (
  account: Partial<SerializableWeb3AuthAccount>,
): Web3AuthAccount => {
  if (
    account.version === undefined ||
    account.address === undefined ||
    account.walletType === undefined ||
    account.algo === undefined ||
    account.pubKey === undefined ||
    account.loginProvider === undefined ||
    account.creationDate === undefined
  ) {
    throw new Error('invalid web3auth account');
  }

  if (account.version !== AccountSerializationVersion.Web3Auth) {
    throw new Error(`unsupported web3auth account version ${account.version}`);
  }

  if (account.walletType !== WalletType.Web3Auth) {
    throw new Error(`invalid web3auth account type ${account.walletType}`);
  }

  if (ACCOUNT_ALGOS.indexOf(account.algo) === -1) {
    throw new Error(`invalid account algo ${account.algo}`);
  }

  const pubKey = fromHex(account.pubKey);

  return {
    walletType: WalletType.Web3Auth,
    address: account.address,
    algo: account.algo,
    pubKey,
    loginProvider: account.loginProvider,
    creationDate: account.creationDate,
  };
};

/**
 * Function to deserialize a JSON serialized [SerializablePrivateKeyAccount].
 * @param account - The JSON object from which we try to deserialize
 * a [SerializablePrivateKeyAccount] instance.
 */
export const deserializePrivateKeyAccount = (
  account: Partial<SerializablePrivateKeyAccount>,
): PrivateKeyAccount => {
  if (
    account.version === undefined ||
    account.address === undefined ||
    account.walletType === undefined ||
    account.algo === undefined ||
    account.pubKey === undefined ||
    account.creationDate === undefined
  ) {
    throw new Error('invalid web3auth account');
  }

  if (account.version !== AccountSerializationVersion.PrivateKey) {
    throw new Error(`unsupported private key account version ${account.version}`);
  }

  if (account.walletType !== WalletType.PrivateKey) {
    throw new Error(`invalid private key account type ${account.walletType}`);
  }

  if (ACCOUNT_ALGOS.indexOf(account.algo) === -1) {
    throw new Error(`invalid account algo ${account.algo}`);
  }

  return {
    walletType: WalletType.PrivateKey,
    address: account.address,
    algo: account.algo,
    pubKey: account.pubKey,
    creationDate: account.creationDate,
  };
};

export const deserializeAccount = (account: Partial<SerializableAccount>): Account => {
  if (account.walletType === undefined) {
    throw new Error('invalid account');
  }

  switch (account.walletType) {
    case WalletType.Mnemonic:
      return deserializeMnemonicAccount(account);
    case WalletType.Ledger:
      return deserializeLedgerAccount(account);
    case WalletType.Web3Auth:
      return deserializeWeb3AuthAccount(account);
    case WalletType.PrivateKey:
      return deserializePrivateKeyAccount(account);
    default:
      throw new Error(`unknown account type ${account.walletType}`);
  }
};

export const deserializeAccounts = (
  accounts: Record<string, SerializableAccount> | undefined,
  defaultValue: Record<string, Account>,
): Record<string, Account> => {
  if (accounts === undefined) {
    return defaultValue;
  }

  const result: Record<string, Account> = {};
  Object.keys(accounts).forEach(address => {
    result[address] = deserializeAccount(accounts[address]);
  });
  return result;
};
