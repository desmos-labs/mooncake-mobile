import { ApolloClient } from '@apollo/client';
import {
  Coin,
  DesmosClient,
  EncodeObject,
  GasPrice,
  Signer,
  TxRaw,
  assertIsDeliverTxSuccess,
} from '@desmoslabs/desmjs';
import { Result, err, ok } from 'neverthrow';
import PostHog from 'posthog-react-native';
import * as Sentry from 'sentry-expo';
import GetAccountBalance from 'services/graphql/queries/GetAccountBalance';
import FindMessageTxHash from 'services/graphql/queries/desmos/FindMessageTxHash';
import GetUserRelationship from 'services/graphql/queries/desmos/GetUserRelationship';
import { GqlGetUserRelationshipResult } from 'types/relationships';
import { GqlFindMessageTxHasResult } from 'types/transactions';
import { promiseToResult } from 'lib/NeverThrowUtils';
import { captureFailedTxError } from 'lib/PostHog/utils';
import { Constants } from 'config/Constants';

/**
 * Creates a {@link DesmosClient} instance with the optimal configurations
 * for the application.
 * @param rpcUrl - RPC url of the Desmos chain.
 * @param signer - Signer that will be used to sign the transaction.
 */
export const buildDesmosClient = async (
  rpcUrl: string,
  signer?: Signer,
  gasPrice?: GasPrice,
): Promise<Result<DesmosClient, Error>> => {
  return promiseToResult(
    signer
      ? DesmosClient.connectWithSigner(rpcUrl, signer, {
          gasPrice,
          gasAdjustment: 1.8,
        })
      : DesmosClient.connect(rpcUrl, {
          gasPrice,
          gasAdjustment: 1.8,
        }),
    'Error connecting to the Desmos chain',
  );
};

/**
 * Function to check if two users have an on-chain
 * relationship.
 * @param apolloClient - Client used to perform the queries.
 * @param creatorAddress - Address of who created the relationship.
 * @param counterpartyAddress - The counterparty of the relationship.
 * @returns Returns the tx hash that created the relationship or undefined
 * if the relationship don't exist.
 */
export const userHaveRelationshipWith = async (
  apolloClient: ApolloClient<object>,
  creatorAddress: string,
  counterpartyAddress: string,
): Promise<string | undefined> => {
  const { data: relationshipData, error: relationshipError } =
    await apolloClient.query<GqlGetUserRelationshipResult>({
      query: GetUserRelationship,
      fetchPolicy: 'network-only',
      variables: {
        creatorAddress,
        counterpartyAddress,
        subspaceId: Constants.subspaceId,
      },
    });
  if (relationshipError) {
    throw relationshipError;
  }

  if (relationshipData === undefined || relationshipData.relationship.length === 0) {
    // We don't have a relationship return undefined.
    return undefined;
  }

  // We have a relationship with the counterparty lets find the tx hash
  // that has created the relationship.
  const { data: txHashResult, error } = await apolloClient.query<GqlFindMessageTxHasResult>({
    query: FindMessageTxHash,
    fetchPolicy: 'network-only',
    variables: {
      typeLike: '%MsgCreateRelationship',
      fields: {
        signer: creatorAddress,
        counterparty: counterpartyAddress,
        subspace_id: Constants.subspaceId.toString(),
      },
    },
  });
  if (error) {
    throw error;
  }

  if (txHashResult === undefined || txHashResult.message.length === 0) {
    return undefined;
  }

  return txHashResult.message[0].txHash;
};

/**
 * Gets the balance of an account.
 * @param apolloClient - Client used to perform the query.
 * @param address - Address of the account for which we want to get the balance.
 */
export const queryUserBalance = async (
  apolloClient: ApolloClient<object>,
  address: string,
): Promise<Result<Coin[], Error>> => {
  const { data, error } = await apolloClient.query({
    query: GetAccountBalance,
    fetchPolicy: 'network-only',
    variables: {
      address,
    },
  });

  if (error) {
    return err(error);
  }
  return ok(data.balance.coins ?? []);
};

/**
 * Checks if the user should use the fee granter to broadcast a transaction
 * or use their balance.
 * @param userBalance - The user's balance.
 * @param txFeeDenom - Denom of the coin should be used to broadcast a transaction.
 */
export const userCanUseOurFeeGranter = (userBalance: Coin[], txFeeDenom: string): boolean => {
  const coin = userBalance.find(c => c.denom === txFeeDenom);
  if (coin === undefined) {
    return true;
  }

  // The user sould use the fee granter only when
  // don't have any coins.
  return coin.amount === '0';
};

/**
 * Sign and brodcast a transaction with the provided fee granter.
 * If the `feeGranter` is undefined will be used the signer's balance
 * to pay the tx fees.
 * @param posthog - The PostHog instance that will be used to
 * collect the broadcast error.
 * @param client - Client used to broadcast the transaction.
 * @param signerAddress - Address of who is performing the transaction.
 * @param msgs - List of messages to broadcast.
 * @param feeGranter - Address of the fee granter.
 */
export const signAndBroadcastWithGranter = async (
  posthog: PostHog,
  client: DesmosClient,
  signerAddress: string,
  msgs: EncodeObject[],
  feeGranter?: string,
) => {
  const txFee = await client.estimateTxFee(signerAddress, msgs, {
    feeGranter,
  });
  const { txRaw } = await client.signTx(signerAddress, msgs, {
    fee: txFee,
    feeGranter,
  });

  const broadcastResult = await promiseToResult(
    client.broadcastTx(TxRaw.encode(txRaw).finish()).then(response => {
      assertIsDeliverTxSuccess(response);
      return response;
    }),
    'Unknown error while broadcasting the transaction',
  );

  if (broadcastResult.isErr()) {
    // Capture the transaction error.
    Sentry.Native.captureException(broadcastResult.error);
    captureFailedTxError(posthog, {
      error: broadcastResult.error,
      fees: txFee,
      messages: msgs,
      userAddress: signerAddress,
    });
  }

  return broadcastResult;
};
