import { Algo } from '@cosmjs/amino';
import { LoginOnboardingStep } from 'types/tourguide';
import { Wallet, WalletType } from 'types/wallet';

export enum AccountSerializationVersion {
  Mnemonic = 1,
  Ledger = 1,
  Web3Auth = 1,
  PrivateKey = 1,
}

/**
 * Interface representing a base user account.
 */
interface BaseAccount {
  /**
   * Type of the wallet associated with this account.
   */
  readonly walletType: WalletType;
  /**
   * Account bech32 address.
   */
  readonly address: string;
  /**
   * Account public key.
   */
  readonly pubKey: Uint8Array;
  /**
   * Account public key type.
   */
  readonly algo: Algo;
  /**
   * Date of account creation.
   */
  readonly creationDate: Date;
}

/**
 * Interface representing an account imported through Web3Auth.
 */
export interface Web3AuthAccount extends BaseAccount {
  readonly walletType: WalletType.Web3Auth;
  /**
   * Login provider used to obtain the user's private key.
   */
  readonly loginProvider: string;
}

export type SerializableWeb3AuthAccount = Omit<Web3AuthAccount, 'pubKey' | 'hdPath'> & {
  readonly version: AccountSerializationVersion.Web3Auth;
  /**
   * hex encoded public key.
   */
  readonly pubKey: string;
};

/**
 * Interface representing an account imported with a private key.
 */
export interface PrivateKeyAccount extends BaseAccount {
  readonly walletType: WalletType.PrivateKey;
}

/**
 * Interface representing a [PrivateKeyAccount] that can be serialized into JSON
 * and stored in the device's storage.
 */
export type SerializablePrivateKeyAccount = PrivateKeyAccount & {
  readonly version: AccountSerializationVersion.PrivateKey;
};

export type Account = Web3AuthAccount | PrivateKeyAccount;

export interface AccountWithWallet {
  readonly account: Account;
  readonly wallet: Wallet;
}

export type SerializableAccount = SerializableWeb3AuthAccount | SerializablePrivateKeyAccount;

/**
 * Interface representing the account information that can be requested from
 * the server.
 */
export interface AccountInfo {
  readonly loginTourLastStep: LoginOnboardingStep;
  readonly creationTime: string;
  readonly desmosAddress: string;
  readonly lastLogin?: string;
  readonly userDeepLink: string;
}
