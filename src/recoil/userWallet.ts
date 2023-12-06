import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { Wallet } from 'types/wallet';

const userWalletAppState = atom<Wallet | undefined>({
  key: 'userWallet',
  default: undefined,
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
