import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { Wallet } from 'types/wallet';

const userWalletAppState = atom<Wallet | undefined>({
  key: 'userWallet',
  default: undefined,
  // This is needed because the Signer inside the WalletConnectWallet
  // mutates during the app execution.
  dangerouslyAllowMutability: true,
});

/**
 * Hook that provides the current user wallet instance.
 * The returned instance is `undefined` if the user did not unlock the wallet yet.
 */
export const useUserWallet = () => useRecoilValue(userWalletAppState);

/**
 * Hook that provides a function to update the user wallet instance.
 */
export const useSetUserWallet = () => useSetRecoilState(userWalletAppState);
