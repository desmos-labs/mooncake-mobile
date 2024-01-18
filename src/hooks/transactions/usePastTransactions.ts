import { useApolloClient } from '@apollo/client';
import { useUserPendingTransactions } from '@recoil/transactions';
import { FetchDataFunction, usePaginatedData } from 'hooks/usePaginatedData';
import { convertGraphQLTransactionMessage } from 'lib/GraphQLUtils/transactions';
import React, { useMemo } from 'react';
import GetTransactionsByAddress from 'services/graphql/queries/GetTransactionsByAddress';
import { PastTransactionMessage, PendingTransaction } from 'types/transactions';

const useFetchPastTransactions = (userAddress: string) => {
  // Here we use the useApolloClient hook instead of the useLazyQuery hook because
  // that hook dont behaves correctly if in the future we may want to implement
  // the possibility to switch between mainnet and testnet.
  const apollo = useApolloClient();

  return React.useCallback<FetchDataFunction<PastTransactionMessage>>(
    async (offset, limit) => {
      const { data, error } = await apollo.query({
        query: GetTransactionsByAddress,
        variables: {
          address: `{${userAddress}}`,
          types: '{}',
          limit,
          offset,
        },
      });

      if (error) {
        throw error;
      }

      const fetchedData = data?.messages ?? [];
      const converted = fetchedData.map(convertGraphQLTransactionMessage);
      return {
        data: converted,
        endReached: fetchedData.length < limit,
      };
    },
    [apollo, userAddress],
  );
};

/**
 * Function that converts a {@link PendingTransaction} into a list of {@link PastTransactionMessage}
 */
const convertPendingTransaction = (
  pendingTransaction: PendingTransaction,
): PastTransactionMessage[] => {
  return pendingTransaction.messages.map(message => {
    return {
      timestamp: pendingTransaction.timestamp,
      type: message.typeUrl,
      fees: pendingTransaction.fees,
    } as PastTransactionMessage;
  });
};

/**
 * Function that merges the two given {@link PastTransactionMessage} arrays by making sure they don't contain the
 * same message having the same type for the same transaction hash, and sorts the result based on their
 * timestamp in descending order.
 */
const mergeTransactions = (
  first: PastTransactionMessage[],
  second: PastTransactionMessage[],
): PastTransactionMessage[] => {
  // Merge the two arrays
  const merged = [...first, ...second];

  // Remove the duplicates
  const uniqueTransactions = merged.filter((message, index) => {
    return (
      merged.findIndex(
        t =>
          t.hash === message.hash &&
          t.type === message.type &&
          t.index === message.index &&
          t.timestamp === message.timestamp,
      ) === index
    );
  });

  // Sort the tx based on their timestamp in descending order
  return uniqueTransactions.sort((m1, m2) => Date.parse(m2.timestamp) - Date.parse(m1.timestamp));
};

/**
 * Hook that allows to retrieve the past actions of a user querying them from the GraphQL server.
 */
const usePastTransactions = (address: string, transactionsPerPage: number = 20) => {
  const pendingTransactions = useUserPendingTransactions(address);

  const pendingMessages = useMemo(() => {
    return pendingTransactions.flatMap(convertPendingTransaction);
  }, [pendingTransactions]);

  const { data, loading, initialLoading, fetchMore, refresh, refreshing, error } = usePaginatedData(
    useFetchPastTransactions(address),
    {
      itemsPerPage: transactionsPerPage,
      extraDelay: 500,
    },
  );

  // Merge the pending tx with the tx from the chain
  const transactions = React.useMemo(() => {
    return mergeTransactions(data, pendingMessages);
  }, [data, pendingMessages]);

  return {
    transactions,
    loading: initialLoading,
    fetchMore,
    fetchingMore: loading,
    refetch: refresh,
    refreshing,
    error,
  };
};

export default usePastTransactions;
