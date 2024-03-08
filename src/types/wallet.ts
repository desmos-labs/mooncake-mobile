import { Signer } from '@desmoslabs/desmjs';

export enum WalletSerializationVersion {
  Web3Auth = 1,
  PrivateKey = 1,
  WalletConnect = 1,
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
  /**
   * Wallet that has been imported through WalletConnect.
   */
  WalletConnect = 'walletconnect',
}

/**
 * Enum that contains the WalletConnect wallets supported by
 * the app.
 */
export enum WalletConnectWalletApp {
  /**
   * Desmos Profile Manager application.
   */
  DPM,
  /**
   * Keplr wallet.
   */
  Keplr,
  /**
   * Leap wallet.
   */
  Leap,
}

/**
 * Interface holding the common fields between each wallet type.
 */
interface BaseWallet<T extends WalletType> {
  /**
   * Wallet type.
   */
  readonly type: T;
  /**
   * Bech32 Address prefix of this wallet.
   */
  readonly addressPrefix: string;
  /**
   * Wallet bech32 address.
   */
  readonly address: string;
  /**
   * Signer that can be used with the DesmosClient to sign tx.
   */
  readonly signer: Signer;
}

/**
 * Interface that represents a generic wallet with a private key.
 */
export interface WalletWithPrivateKey<T extends WalletType> extends BaseWallet<T> {
  /**
   * Secp256k1 private key obtained from Web3Auth.
   */
  readonly privateKey: Uint8Array;
}

/**
 * Interface representing a wallet imported through Web3Auth.
 */
export interface Web3AuthWallet extends WalletWithPrivateKey<WalletType.Web3Auth> {
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
export interface PrivateKeyWallet extends WalletWithPrivateKey<WalletType.PrivateKey> {}

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
 * Interface representing a wallet imported through WalletConnect.
 */
export interface WalletConnectWallet extends BaseWallet<WalletType.WalletConnect> {
  /**
   * The application used to import this wallet.
   */
  readonly walletApp: WalletConnectWalletApp;
  /**
   * The temporary wallet to use to perform the operations
   * without the need to open the external wallet application.
   * If undefined, we should open the external app wallet to
   * sign the transaction.
   */
  readonly tempWallet?: {
    /**
     * Bech32 address.
     */
    readonly address: string;
    /**
     * Private key.
     */
    readonly privateKey: Uint8Array;
  };
}

/**
 * Type representing an instance of [WalletConnectWallet] that can be serialized to JSON.
 */
export type SerializableWalletConnectWallet = Omit<WalletConnectWallet, 'signer'> & {
  readonly version: WalletSerializationVersion.WalletConnect;
};

/**
 * Type representing all the supported wallets.
 */
export type Wallet = Web3AuthWallet | PrivateKeyWallet | WalletConnectWallet;

/**
 * Type representing a wallet that can be serialized to JSON and
 * stored in the device storage.
 */
export type SerializableWallet =
  | SerializableWeb3AuthWallet
  | SerializablePrivateKeyWallet
  | SerializableWalletConnectWallet;
