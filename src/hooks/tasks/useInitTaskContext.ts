import React from 'react';
import { useApolloClient } from '@apollo/client';
import { usePostHog } from 'posthog-react-native';
import { DesmosClient, EncodeObject } from '@desmoslabs/desmjs';
import { useCurrentChainInfo } from '@recoil/settings';
import { setTaskContext } from 'lib/BackgroundTaskUtils';
import { useAppStateValue } from '@recoil/appState';
import {
  queryUserBalance,
  signAndBroadcastWithGranter,
  userCanUseOurFeeGranter,
} from 'lib/TxUtils';
import { unwrapResult } from 'lib/NeverThrowUtils';
import { getFeeGrantAllowanceForMessages, getOnChainGrants } from 'lib/grantsUtils';

/**
 * Hook that will initialize the taks context and will update it if
 * one or more objects of wich depends changes.
 */
const useInitTaskContext = () => {
  const apiBearerToken = useAppStateValue('bearerToken');
  const apolloClient = useApolloClient();
  const chainInfo = useCurrentChainInfo();
  const postHog = usePostHog();

  const broadcastTx = React.useCallback(
    async (client: DesmosClient, signer: string, msgs: EncodeObject[], memo?: string) => {
      let feeGranter: string | undefined;
      // Check if the user have enough balance to perform the transaction.
      const useFeeGranter = await queryUserBalance(apolloClient, signer)
        .then(unwrapResult)
        .then(balance =>
          userCanUseOurFeeGranter(balance, chainInfo!.stakeCurrency.coinMinimalDenom),
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

      // Broadcast the messages.
      return signAndBroadcastWithGranter(postHog!, client, signer, msgs, {
        feeGranter,
        memo,
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
