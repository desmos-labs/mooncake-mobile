import { Signer } from '@desmoslabs/desmjs';

export enum WalletSerializationVersion {
  Web3Auth = 1,
  PrivateKey = 1,
}

/**
 * Enum that represents the type of wallet that the app supports.
 */
export enum WalletType {
  /**
   * Wallet imported using Web3Auth.
   */
  Web3Auth = 'web3auth',
  /**
   * Wallet that has been imported with a private key.
   */
  PrivateKey = 'private_key',
}

/**
 * Interface holding the common fields between each wallet type.
 */
interface BaseWallet {
  /**
   * Bech32 Address prefix of this wallet.
   */
  readonly addressPrefix: string;
  /**
   * Wallet bech32 address.
   */
  readonly address: string;
  /**
   * Signer that can be used with the DesmosClient to sign transactions.
   */
  readonly signer: Signer;
}

/**
 * Interface that represents a generic wallet with a private key.
 */
export interface WalletWithPrivateKey extends BaseWallet {
  /**
   * Secp256k1 private key obtained from Web3Auth.
   */
  readonly privateKey: Uint8Array;
}

/**
 * Interface representing a wallet imported through Web3Auth.
 */
export interface Web3AuthWallet extends WalletWithPrivateKey {
  readonly type: WalletType.Web3Auth;
  /**
   * Login method used from the user.
   */
  readonly loginProvider: string;
}

/**
 * [Web3AuthWallet] that can be serialized to JSON.
 */
export type SerializableWeb3AuthWallet = Omit<Web3AuthWallet, 'signer' | 'privateKey'> & {
  version: WalletSerializationVersion.Web3Auth;
  /**
   * Hex encoded private key.
   */
  privateKey: string;
};

/**
 * Interface representing a wallet imported through a private key.
 */
export interface PrivateKeyWallet extends WalletWithPrivateKey {
  readonly type: WalletType.PrivateKey;
}

/**
 * [PrivateKeyWallet] that can be serialized to JSON.
 */
export type SerializablePrivateKeyWallet = Omit<PrivateKeyWallet, 'signer' | 'privateKey'> & {
  readonly version: WalletSerializationVersion.PrivateKey;
  /**
   * Hex encoded private key.
   */
  privateKey: string;
};

/**
 * Type representing all the supported wallets.
 */
export type Wallet = Web3AuthWallet | PrivateKeyWallet;

/**
 * Type representing a wallet that can be serialized to JSON and
 * stored in the device storage.
 */
export type SerializableWallet = SerializableWeb3AuthWallet | SerializablePrivateKeyWallet;

export interface BaseWalletGenerationData {
  readonly accountPrefix: string;
}

/**
 * Interface that represents the data required to generate a [Web3AuthWallet].
 */
export interface Web3AuthGenerationData extends BaseWalletGenerationData {
  readonly type: WalletType.Web3Auth;
  readonly privateKey: Uint8Array;
  readonly loginProvider: string;
}

/**
 * Interface that represents the data required to generate a [PrivateKeyWallet].
 */
export interface PrivateKeyGenerationData extends BaseWalletGenerationData {
  readonly type: WalletType.PrivateKey;
  readonly privateKey: Uint8Array;
}

/**
 * Type union that represents the data required to generate a [Wallet].
 */
export type WalletGenerationData = Web3AuthGenerationData | PrivateKeyGenerationData;
