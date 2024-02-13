import { atom, useRecoilCallback, useSetRecoilState } from 'recoil';
import { Wallet } from 'types/wallet';

const userWalletAppState = atom<Wallet | undefined>({
  key: 'userWallet',
  default: undefined,
  // This is needed because the Signer inside the WalletConnectWallet
  // mutates during the app execution.
  dangerouslyAllowMutability: true,
});

/**
 * Hook that provides a function to get the current unlocked user wallet.
 * If undefined means that the user did not unlock the wallet yet.
 */
export const useGetUserWallet = () =>
  useRecoilCallback(
    ({ snapshot }) =>
      async (): Promise<Wallet | undefined> =>
        snapshot.getPromise(userWalletAppState),
  );

/**
 * Hook that provides a function to update the user wallet instance.
 */
export const useSetUserWallet = () => useSetRecoilState(userWalletAppState);
