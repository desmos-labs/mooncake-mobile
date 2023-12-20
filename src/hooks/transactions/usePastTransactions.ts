import { useQuery } from '@apollo/client';
import { useUserPendingTransactions } from '@recoil/transactions';
import { convertGraphQLTransactionMessage } from 'lib/GraphQLUtils/transactions';
import sleep from 'lib/sleep';
import React, { useMemo, useState } from 'react';
import GetTransactionsByAddress from 'services/graphql/queries/GetTransactionsByAddress';
import { PastTransactionMessage, PendingTransaction } from 'types/transactions';

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
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const pendingMessages = useMemo(() => {
    return pendingTransactions.flatMap(convertPendingTransaction);
  }, [pendingTransactions]);

  // Query the past tx from the server
  const { data, fetchMore, refetch } = useQuery(GetTransactionsByAddress, {
    variables: {
      address: `{${address}}`,
      limit: transactionsPerPage,
      offset: 0,
      types: '{}',
    },
  });

  // Merge the pending tx with the tx from the chain
  const transactions = React.useMemo(() => {
    if (!data) {
      return [];
    }
    const onChainMessages = (data.messages as any[]).map(convertGraphQLTransactionMessage);
    setLoading(false);
    setFetchingMore(false);
    setRefreshing(false);
    return mergeTransactions(onChainMessages, pendingMessages);
  }, [data, pendingMessages]);

  // Callback to fetch more tx
  const fetchMoreTransactions = React.useCallback(async () => {
    if (fetchingMore) {
      return;
    }
    setFetchingMore(true);
    try {
      await fetchMore({
        variables: { offset: transactions.length },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || fetchMoreResult.messages.length === 0) {
            return prev;
          }

          return {
            messages: [...prev.messages, ...fetchMoreResult.messages],
          };
        },
      });
    } catch (e: any) {
      setError(e.toString());
    } finally {
      await sleep(500).then(() => setFetchingMore(false));
    }
  }, [fetchMore, fetchingMore, transactions.length]);

  // Callback to be called when the tx list is refreshed
  const refetchTransactions = React.useCallback(async () => {
    try {
      setError(undefined);
      setRefreshing(true);
      // Get the new data by resetting the fetch offset to restart post fetching
      await refetch({ offset: 0 });
    } catch (e: any) {
      setError(e.toString());
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return {
    transactions,
    loading,
    fetchMore: fetchMoreTransactions,
    fetchingMore,
    refetch: refetchTransactions,
    refreshing,
    error,
  };
};

export default usePastTransactions;
