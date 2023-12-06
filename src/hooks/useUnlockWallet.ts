import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SigningMode } from '@desmoslabs/desmjs';
import { err, ok, Result } from 'neverthrow';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useReturnToCurrentScreen, {
  ReturnToCurrentScreenParams,
} from 'hooks/navigation/useReturnToCurrentScreen';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { Wallet } from 'types/wallet';
import ROUTES from 'navigation/routes';
import { useActiveAccount } from '@recoil/accounts';
import { CanceledOperationError } from 'types/error';
import { UnlockWalletParams } from 'screens/UnlockWallet';
import { useSetUserWallet, useUserWallet } from '@recoil/userWallet';

export interface UnlockWalletResult {
  /**
   * The wallet that was unlocked.
   */
  wallet: Wallet;
  /**
   * Optional password instance that is returned only
   * when the user insert the password to unlock the wallet.
   */
  password?: string;
}

export interface UnlockWalletConfig {
  /**
   * Address of the wallet to unlock.
   * If `undefined`, the active account will be used.
   */
  readonly toUnlockAddress?: string;
  /**
   * Wallet signing mode.
   * If undefined, the {@link SigningMode.DIRECT} mode will be used.
   */
  readonly signingMode?: SigningMode;
  /**
   * Unlock wallet screen params.
   */
  readonly params?: Pick<
    UnlockWalletParams,
    'titleLabelOverride' | 'subtitleLabelOverride' | 'optionalBodyText'
  >;
  readonly optionalOnSuccess?: (wallet: Wallet) => void;
  /**
   * When set to `true`, it enforces the password prompt, even if the user has
   * previously unlocked the wallet.
   */
  readonly forceRequestPassword?: boolean;
}

/**
 * Hooks that provides a function to unlock and access a user wallet.
 */
const useUnlockWallet = (params?: ReturnToCurrentScreenParams) => {
  const returnToCurrentScreen = useReturnToCurrentScreen(params);
  const navigator = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();
  const activeAccount = useActiveAccount();
  const userWallet = useUserWallet();
  const setUserWallet = useSetUserWallet();

  return useCallback(
    (config?: UnlockWalletConfig): Promise<Result<UnlockWalletResult, Error>> => {
      const address = config?.toUnlockAddress ?? activeAccount!.address;

      if (address === undefined) {
        return Promise.resolve(err(new Error('no account selected')));
      }

      if (userWallet && config?.forceRequestPassword !== true) {
        // We already have the user wallet instance, lets just return it.
        return Promise.resolve(
          ok({
            wallet: userWallet,
          }),
        );
      }

      return new Promise<Result<UnlockWalletResult, Error>>(resolve => {
        navigator.navigate(ROUTES.UNLOCK_WALLET, {
          address,
          onSuccess: (wallet, password) => {
            // Update the global wallet instance.
            setUserWallet(wallet);
            resolve(
              ok({
                wallet,
                password,
              }),
            );
            config?.optionalOnSuccess ? config?.optionalOnSuccess(wallet) : returnToCurrentScreen();
          },
          onCancel: () => {
            resolve(err(new CanceledOperationError()));
            returnToCurrentScreen();
          },
          signingMode: config?.signingMode,
          ...config?.params,
        });
      });
    },
    [activeAccount, navigator, returnToCurrentScreen, setUserWallet, userWallet],
  );
};

export default useUnlockWallet;
