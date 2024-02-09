import { atom, useRecoilCallback, useSetRecoilState } from 'recoil';
import { WalletConnectClientState, WalletConnectClientStatus } from 'types/walletconnect';

/**
 * Atom that contains the WalletConnect client with its state.
 */
const walletConnectClientAppState = atom<WalletConnectClientState>({
  key: 'walletConnectClientAppState',
  default: {
    status: WalletConnectClientStatus.Disconnected,
  },
  // We need this because the internal WalletConnect object mutates during the
  // application execution.
  dangerouslyAllowMutability: true,
});

/**
 * Hook that provides a function to update the WalletConnect client state.
 */
export const useSetWalletConnectClientState = () => {
  return useSetRecoilState(walletConnectClientAppState);
};

/**
 * Hook that provides a function to get the current WalletConnect client state.
 */
export const useGetWalletConnectClientState = () => {
  return useRecoilCallback(
    ({ snapshot }) =>
      () =>
        snapshot.getPromise(walletConnectClientAppState),
  );
};
