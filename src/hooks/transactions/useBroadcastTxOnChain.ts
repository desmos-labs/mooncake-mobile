import { EncodeObject } from '@desmoslabs/desmjs';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import React from 'react';
import ROUTES from 'navigation/routes';
import { useActiveAccountAddress } from '@recoil/accounts';
import useReturnToCurrentScreen from 'hooks/navigation/useReturnToCurrentScreen';
import { Wallet } from 'types/wallet';
import { errAsync, ResultAsync } from 'neverthrow';
import { CanceledOperationError } from 'types/error';
import { BroadcastTxOnChainResult, BroadcastTxResult } from 'types/transactions';

export interface BroadcastTxOptions {
  /**
   * Address of who is signing the transaction, if undefined will be used
   * the current active account.
   */
  accountAddressOrWallet?: string | Wallet;
  /**
   * Optional transaction memo.
   */
  memo?: string;
}

/**
 * Hook that allows to broadcast a transaction on chain by going through the various UI.
 * The flow will vary based on the wallet type the user is using (mnemonic, Ledger, Web3Auth, etc).
 */
const useBroadcastTxOnChain = () => {
  const activeAccountAddress = useActiveAccountAddress();

  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const returnToCurrentScreen = useReturnToCurrentScreen();

  return React.useCallback(
    (
      messages: EncodeObject[],
      options?: BroadcastTxOptions,
    ): ResultAsync<BroadcastTxResult, Error> => {
      if (!activeAccountAddress) {
        return errAsync(new Error('Trying to broadcast a transaction without active account'));
      }

      return ResultAsync.fromPromise<BroadcastTxOnChainResult, Error>(
        new Promise((resolve, reject) => {
          navigation.navigate(ROUTES.BROADCAST_TX_ON_CHAIN, {
            messages,
            accountAddressOrWallet: options?.accountAddressOrWallet ?? activeAccountAddress,
            memo: options?.memo,
            onSuccess: (txResponse: BroadcastTxOnChainResult) => {
              returnToCurrentScreen();
              resolve(txResponse);
            },
            onCancel: () => {
              reject(new Error('Operation canceled'));
            },
          });
        }),
        () => new CanceledOperationError(),
      );
    },
    [activeAccountAddress, navigation, returnToCurrentScreen],
  );
};

export default useBroadcastTxOnChain;
