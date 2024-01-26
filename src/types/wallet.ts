import { Signer } from '@desmoslabs/desmjs';

export enum WalletSerializationVersion {
  Web3Auth = 1,
  PrivateKey = 1,
  WallletConnectKeplr = 1,
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
   * Wallet imported using WalletConnect.
   */
  WalletConnect = 'walletconnect',
}

/**
 * Interface holding the common fields between each wallet type.
 */
interface BaseWallet<T extends WalletType> {
  /**
   * The wallet type.
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
 * The WalletConnect clients that the application supports.
 */
export enum WalletConnectWalletClient {
  Keplr = 'keplr',
}

/**
 * Interface that represents a wallet imported using WalletConnect.
 */
interface BaseWalletConnectWallet<C extends WalletConnectWalletClient>
  extends BaseWallet<WalletType.WalletConnect> {
  /**
   * The client that the wallet is connected to.
   */
  readonly client: C;
}

/**
 * Interface that represents a wallet imported using WalletConnect
 * that can be serialization to JSON.
 * @param C - The client that the wallet is connected to.
 * @param V - The serialization version.
 */
interface BaseSerializableWalletConnectWallet<
  C extends WalletConnectWalletClient,
  V extends WalletSerializationVersion,
> extends Omit<BaseWalletConnectWallet<C>, 'signer'> {
  readonly version: V;
}

/**
 * Interface that represents a wallet imported through Keplr.
 */
export interface KeplrWalletConnectWallet
  extends BaseWalletConnectWallet<WalletConnectWalletClient.Keplr> {}

/**
 * [KeplrWalletConnectWallet] that can be serialized to JSON.
 */
export interface SerializableKeplrWalletConnectWallet
  extends BaseSerializableWalletConnectWallet<
    WalletConnectWalletClient.Keplr,
    WalletSerializationVersion.WallletConnectKeplr
  > {}

/**
 * Type representing a wallet that was imported through WalletConnect.
 */
export type WalletConnectWallet = KeplrWalletConnectWallet;

/**
 * Type representing a [WalletConnectWallet] that can be serialized to JSON.
 */
export type SerializableWalletConnectWallet = SerializableKeplrWalletConnectWallet;

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
