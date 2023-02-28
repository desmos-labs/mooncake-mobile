import { DeliverTxResponse, EncodeObject } from '@desmoslabs/desmjs';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import React from 'react';
import ROUTES from 'navigation/routes';
import { useActiveAccount } from '@recoil/accounts';
import useReturnToCurrentScreen from 'hooks/navigation/useReturnToCurrentScreen';
import { Wallet } from 'types/wallet';
import { ResultAsync } from 'neverthrow';
import { CanceledOperationError } from 'types/error';

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
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const activeAccount = useActiveAccount()!;
  const returnToCurrentScreen = useReturnToCurrentScreen();

  return React.useCallback(
    (messages: EncodeObject[], options?: BroadcastTxOptions) => {
      return ResultAsync.fromPromise<DeliverTxResponse, Error>(
        new Promise((resolve, reject) => {
          navigation.navigate(ROUTES.BROADCAST_TX_ON_CHAIN, {
            messages,
            accountAddressOrWallet: options?.accountAddressOrWallet ?? activeAccount.address,
            memo: options?.memo,
            onSuccess: (txResponse: DeliverTxResponse) => {
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
    [activeAccount, navigation, returnToCurrentScreen],
  );
};

export default useBroadcastTxOnChain;
