import { useApolloClient } from '@apollo/client';
import { Registry } from '@cosmjs/proto-signing';
import { DesmosRegistry } from '@desmoslabs/desmjs';
import { MsgExec } from '@desmoslabs/desmjs-types/cosmos/authz/v1beta1/tx';
import { useAppStateValue } from '@recoil/appState';
import { useCurrentChainInfo } from '@recoil/settings';
import { setTaskContext } from 'lib/BackgroundTaskUtils';
import { TaskContext } from 'lib/BackgroundTaskUtils/types';
import { getFeeGrantAllowanceForMessages, getOnChainGrants } from 'lib/grantsUtils';
import { unwrapResult } from 'lib/NeverThrowUtils';
import { canUseFeeGranter, queryUserBalance, signAndBroadcastWithGranter } from 'lib/TxUtils';
import { usePostHog } from 'posthog-react-native';
import React, { useRef } from 'react';
import { MsgExecTypeUrl } from 'types/desmos';
import { WalletType } from 'types/wallet';

/**
 * Hook that will initialize the taks context and will update it if
 * one or more objects of wich depends changes.
 */
const useInitTaskContext = () => {
  const apiBearerToken = useAppStateValue('bearerToken');
  const apolloClient = useApolloClient();
  const chainInfo = useCurrentChainInfo();
  const postHog = usePostHog();
  const registry = useRef(new Registry(DesmosRegistry));

  const broadcastTx = React.useCallback<TaskContext['broadcastTx']>(
    async (client, account, msgs, memo) => {
      let feeGranter: string | undefined;
      let messages = msgs;
      let signer = account.address;

      if (account.type === WalletType.WalletConnect && account.tempWallet) {
        // We have an account with a temp wallet that can perform operations on
        // behalf of the user.

        // Set the fee granter as the account address.
        feeGranter = account.address;
        // Set the tx signer as the temp wallet that has the permissions.
        signer = account.tempWallet.address;
        // Wrap the messages into a MsgExec to run the message on behalf of the
        // user.
        messages = [
          {
            typeUrl: MsgExecTypeUrl,
            value: MsgExec.fromPartial({
              msgs: msgs.map(m => registry.current.encodeAsAny(m)),
              grantee: account.tempWallet.address,
            }),
          },
        ];
      }

      if (feeGranter === undefined) {
        // Check if the user have enough balance to perform the transaction.
        const useFeeGranter = await queryUserBalance(apolloClient, signer)
          .then(unwrapResult)
          .then(balance =>
            canUseFeeGranter(balance, chainInfo!.stakeCurrency.coinMinimalDenom),
          );

        if (useFeeGranter) {
          // Get the feeGranter from the chain.
          const feeGrant = await getOnChainGrants(apolloClient, signer)
            .then(unwrapResult)
            .then(grants =>
              getFeeGrantAllowanceForMessages(
                grants,
                msgs.map(m => m.typeUrl),
              ),
            );
          feeGranter = feeGrant?.granterAddress;
        }
      }

      // Broadcast the messages.
      return signAndBroadcastWithGranter(postHog!, client, signer, messages, {
        feeGranter,
        // The memo of the transactions must always contain the "Sent using Mooncake" text to
        // allow the backend logic to know that a transaction has been sent from the app.
        memo: memo ? `${memo} - Sent using Mooncake` : 'Sent using Mooncake',
      }).then(unwrapResult);
    },
    [apolloClient, chainInfo, postHog],
  );

  React.useEffect(() => {
    if (postHog && chainInfo) {
      setTaskContext({
        broadcastTx,
        apiBearerToken,
        chainInfo,
        postHog,
        apolloClient,
      });
    }
  }, [apiBearerToken, apolloClient, broadcastTx, chainInfo, postHog]);
};

export default useInitTaskContext;
