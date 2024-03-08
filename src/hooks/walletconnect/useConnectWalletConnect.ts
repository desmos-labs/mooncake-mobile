import {
  useGetWalletConnectClientState,
  useSetWalletConnectClientState,
} from '@recoil/walletconnect';
import { EventEmitter } from 'events';
import { Result, err, ok } from 'neverthrow';
import { useCallback } from 'react';
import SignClient from '@walletconnect/sign-client';
import { WalletConnectClientStatus } from 'types/walletconnect';
import EnvConfig from 'config/EnvConfig';
import { promiseToResult } from 'lib/NeverThrowUtils';
import NetInfo from '@react-native-community/netinfo';
import WCMMKVStorage from 'lib/MMKVStorage/walletconnect';

const CONNECTION_RESULT = 'connection_result';
const ConnectionEventListener = new EventEmitter();

/**
 * Hook that provides a function to connect to the WalletConnect client.
 * If the client is already connecting this function will wait until the client
 * is connected or an error occurs.
 */
const useConnectWalletConnect = () => {
  const getState = useGetWalletConnectClientState();
  const setState = useSetWalletConnectClientState();

  return useCallback<() => Promise<Result<SignClient, Error>>>(async () => {
    const state = await getState();
    // Client already connected, return it.
    if (state.status === WalletConnectClientStatus.Connected) {
      return ok(state.client);
    }

    // Client is connecting, wait for it to connect.
    if (state.status === WalletConnectClientStatus.Connecting) {
      // Wait for the client to connect.
      return new Promise(resolve => {
        ConnectionEventListener.once(
          CONNECTION_RESULT,
          (connectedClient?: SignClient, error?: Error) => {
            if (error) {
              resolve(err(error));
            } else {
              resolve(ok(connectedClient!));
            }
          },
        );
      });
    }

    // Check for internet connection before connecting.
    const netState = await NetInfo.fetch();
    if (!netState.isInternetReachable) {
      return err(new Error('No internet connection'));
    }

    setState({ status: WalletConnectClientStatus.Connecting });
    // Client is disconnected, initialize it.
    const signClientInitResult = await promiseToResult(
      SignClient.init({
        projectId: EnvConfig.WALLET_CONNECT_PROJECT_ID,
        metadata: {
          name: 'Mooncake',
          description: 'Mooncake',
          url: 'https://mooncake.space',
          icons: ['https://mooncake.space/favicon.ico'],
        },
        logger: 'silent',
        storage: WCMMKVStorage,
      }),
      'Unknown error while initializing the WalletConnect client',
    ).mapErr(() => new Error('Error while initializing the WalletConnect client'));
    // Emit the events after connecting the client.
    if (signClientInitResult.isOk()) {
      setState({ status: WalletConnectClientStatus.Connected, client: signClientInitResult.value });
      ConnectionEventListener.emit(CONNECTION_RESULT, signClientInitResult.value, undefined);
    } else {
      setState({ status: WalletConnectClientStatus.Disconnected });
      ConnectionEventListener.emit(CONNECTION_RESULT, undefined, signClientInitResult.error);
    }

    // Return the client.
    return signClientInitResult;
  }, [getState, setState]);
};

export default useConnectWalletConnect;
