import { Algo } from '@cosmjs/amino';
import { LoginOnboardingStep } from 'types/tourguide';
import { Wallet, WalletConnectWalletApp, WalletType } from 'types/wallet';

export enum AccountSerializationVersion {
  Web3Auth = 1,
  PrivateKey = 1,
  WalletConnectDPM = 1,
}

/**
 * Interface representing a base user account.
 */
interface BaseAccount<W extends WalletType> {
  /**
   * Type of the wallet associated with this account.
   */
  readonly walletType: W;
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
export interface Web3AuthAccount extends BaseAccount<WalletType.Web3Auth> {
  /**
   * Login provider used to obtain the user's private key.
   */
  readonly loginProvider: string;
}

export type SerializableWeb3AuthAccount = Omit<Web3AuthAccount, 'pubKey'> & {
  readonly version: AccountSerializationVersion.Web3Auth;
  /**
   * hex encoded public key.
   */
  readonly pubKey: string;
};

/**
 * Interface representing an account imported with a private key.
 */
export interface PrivateKeyAccount extends BaseAccount<WalletType.PrivateKey> {}

/**
 * Interface representing a [PrivateKeyAccount] that can be serialized into JSON
 * and stored in the device's storage.
 */
export type SerializablePrivateKeyAccount = PrivateKeyAccount & {
  readonly version: AccountSerializationVersion.PrivateKey;
};

/**
 * Interface representing an account imported through WalletConnect.
 */
interface BaseWalletConnectAccount<C extends WalletConnectWalletApp>
  extends BaseAccount<WalletType.WalletConnect> {
  /**
   * WalletConnect wallet used to import this account.
   */
  readonly walletApp: C;
  /**
   * WalletConnect session used to import this account.
   */
  readonly sessionTopic: string;

  /**
   * The temporary wallet to use to perform the operations
   * without the need to open the external wallet application.
   * If undefined, we should open the external app wallet to
   * sign the operations.
   */
  readonly tempWallet?: {
    /**
     * Temp wallet address.
     */
    readonly address: string;
    /**
     * Temp wallet public key.
     */
    readonly pubKey: Uint8Array;
    /**
     * Types of messages that has been authorized
     * by the user to be signed by our temporary wallet.
     */
    readonly authorizedMessages: string[];
    /**
     * Expiration date of the authorizations,
     * after this date the temporary wallet will be
     * unable to perform operations on behalf of the user.
     */
    readonly authorizationExpiration: Date;
  };
}

/**
 * Type that represents an account imported through DPM.
 */
type DPMWalletConnectAccount = BaseWalletConnectAccount<WalletConnectWalletApp.DPM>;

/**
 * Type that represents a [DPMWalletConnectAccount] that can be serialized
 * into JSON and stored in the device's storage.
 */
type SerializableDPMWalletConnectAccount = DPMWalletConnectAccount & {
  readonly version: AccountSerializationVersion.WalletConnectDPM;
};

export type WalletConnectAccount = DPMWalletConnectAccount;
export type Account = Web3AuthAccount | PrivateKeyAccount | WalletConnectAccount;

export interface AccountWithWallet {
  readonly account: Account;
  readonly wallet: Wallet;
}

export type SerializableWalletConnectAccount = SerializableDPMWalletConnectAccount;

export type SerializableAccount =
  | SerializableWeb3AuthAccount
  | SerializablePrivateKeyAccount
  | SerializableWalletConnectAccount;

/**
 * Interface that represents the information
 * about the user's account that can be updated.
 */
interface UpdatableAccountInfo {
  readonly loginTourLastStep: LoginOnboardingStep;
  readonly languageIsoCode: string;
}

/**
 * Interface representing the account information that can be requested from
 * the server.
 */
export interface AccountInfo extends UpdatableAccountInfo {
  readonly desmosAddress: string;
  readonly creationTime: string;
  readonly lastLogin?: string;
}
