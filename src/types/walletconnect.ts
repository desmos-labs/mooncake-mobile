import SignClient from '@walletconnect/sign-client';

/**
 * Enum that contains the status of the WalletConnect client.
 */
export enum WalletConnectClientStatus {
  /**
   * The WalletConnect client is not connected.
   */
  Disconnected = 'disconnected',
  /**
   * The WalletConnect client is connecting.
   */
  Connecting = 'connecting',
  /**
   * The WalletConnect client is connected.
   */
  Connected = 'connected',
}

/**
 * Interface that represents the base state of the WalletConnect client state.
 */
interface BaseWalletConnectClientState<S extends WalletConnectClientStatus> {
  readonly status: S;
}

/**
 * Interface that represents the disconnected state of the WalletConnect client state.
 */
interface DisconnectedWalletConnectClientState
  extends BaseWalletConnectClientState<WalletConnectClientStatus.Disconnected> {}

/**
 * Interface that represents the connecting state of the WalletConnect client state.
 */
interface ConnectingWalletConnectClientState
  extends BaseWalletConnectClientState<WalletConnectClientStatus.Connecting> {}

/**
 * Interface that represents the connected state of the WalletConnect client state.
 */
interface ConnectedWalletConnectClientState
  extends BaseWalletConnectClientState<WalletConnectClientStatus.Connected> {
  readonly client: SignClient;
}

/**
 * Type that represents the state of the WalletConnect client.
 */
export type WalletConnectClientState =
  | DisconnectedWalletConnectClientState
  | ConnectingWalletConnectClientState
  | ConnectedWalletConnectClientState;
