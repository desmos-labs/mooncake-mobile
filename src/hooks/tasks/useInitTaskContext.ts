import { useApolloClient } from '@apollo/client';
import { useAppStateValue } from '@recoil/appState';
import { useCurrentChainInfo } from '@recoil/settings';
import { setTaskContext } from 'lib/BackgroundTaskUtils';
import { TaskContext } from 'lib/BackgroundTaskUtils/types';
import { getFeeGrantAllowanceForMessages, getOnChainGrants } from 'lib/grantsUtils';
import { unwrapResult } from 'lib/NeverThrowUtils';
import { canUseFeeGranter, queryUserBalance, signAndBroadcastWithGranter } from 'lib/TxUtils';
import { usePostHog } from 'posthog-react-native';
import React from 'react';

/**
 * Hook that will initialize the taks context and will update it if
 * one or more objects of wich depends changes.
 */
const useInitTaskContext = () => {
  const apiBearerToken = useAppStateValue('bearerToken');
  const apolloClient = useApolloClient();
  const chainInfo = useCurrentChainInfo();
  const postHog = usePostHog();

  const broadcastTx = React.useCallback<TaskContext['broadcastTx']>(
    async (client, signer, msgs, params) => {
      let { feeGranter } = params ?? {};

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
      return signAndBroadcastWithGranter(postHog!, client, signer, msgs, {
        feeGranter,
        // The memo of the transactions must always contain the "Sent using Mooncake" text to
        // allow the backend logic to know that a transaction has been sent from the app.
        memo: params.memo ? `${params.memo} - Sent using Mooncake` : 'Sent using Mooncake',
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
