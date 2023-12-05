import { EncodeObject } from '@cosmjs/proto-signing';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { errAsync, ResultAsync } from 'neverthrow';
import { DeliverTxResponse } from '@desmoslabs/desmjs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useReturnToCurrentScreen from 'hooks/navigation/useReturnToCurrentScreen';
import { AccountWithWallet } from 'types/account';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';

export interface UseNavigateToSignAndBroadcastTxParams {
  /**
   * The account or address that will sign and broadcast the transaction.
   */
  readonly accountOrAddress: AccountWithWallet | string;

  /**
   * The messages that will be included in the transaction.
   */
  readonly messages: EncodeObject[];

  /**
   * The address of the fee granter that will pay the fees for the transaction.
   */
  readonly feeGranter?: string;

  /**
   * The custom header that will be shown in the status screen.
   */
  readonly customHeader?: string;

  /**
   * The custom body that will be shown in the status screen.
   */
  readonly customBody?: string;

  /**
   * The custom animation that will be shown in the status screen.
   */
  readonly customAnimation?: LottieAnimation;

  /**
   * The callback that will be called when the transaction is successfully broadcasted.
   */
  readonly onSuccess?: (tx: DeliverTxResponse) => void;

  /**
   * The callback that will be called when the transaction fails.
   */
  readonly onError?: (e: Error) => void;

  /**
   * The text that will be shown in the button displayed to the user if the transaction fails.
   */
  readonly onErrorButtonText?: string;

  /**
   * The action that will be executed when the user presses the button displayed if the transaction fails.
   */
  readonly onErrorButtonAction?: () => any;
}

/**
 * Hook that provides a function used to navigate to the screen that allows to sign and broadcast.
 * Optionally, it allows to provide callbacks that will be called when the transaction is successfully
 * broadcasted, when the user cancels the transaction or when an error occurs.
 */
const useNavigateToSignAndBroadcastTx = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();
  const returnToCurrentScreen = useReturnToCurrentScreen();

  return React.useCallback(
    (params: UseNavigateToSignAndBroadcastTxParams): ResultAsync<DeliverTxResponse, Error> => {
      if (!params.accountOrAddress) {
        return errAsync(
          new Error('Trying to broadcast a transaction without an account or address'),
        );
      }

      return ResultAsync.fromPromise<DeliverTxResponse, Error>(
        new Promise((resolve, reject) => {
          navigate(ROUTES.TX_LOADING, {
            accountOrAddress: params.accountOrAddress,
            messages: params.messages,
            feeGranter: params.feeGranter,
            customHeader: params.customHeader,
            customBody: params.customBody,
            customAnimation: params.customAnimation,
            onSuccess: (tx: DeliverTxResponse) => {
              params.onSuccess ? params.onSuccess(tx) : returnToCurrentScreen();
              resolve(tx);
            },
            onError: (e: Error) => {
              if (params.onError) params.onError(e);
              reject(e);
            },
            onErrorButtonText: params.onErrorButtonText,
            onErrorButtonAction: params.onErrorButtonAction ?? returnToCurrentScreen,
          });
        }),
        (e: any) => {
          console.error(e);
          return Error(e);
        },
      );
    },

    [navigate, returnToCurrentScreen],
  );
};

export default useNavigateToSignAndBroadcastTx;
