import React from 'react';
import { PastTransactionMessage, PendingTransaction } from 'types/transactions';
import { useQuery } from '@apollo/client';
import GetTransactionsByAddress from 'services/graphql/queries/GetTransactionsByAddress';
import { usePendingTransactions } from '@recoil/transactions';
import { convertGraphQLTransactionMessage } from 'lib/GraphQLUtils/transactions';
import useUpdatePendingTransactions from 'hooks/transactions/useUpdatePendingTransactions';

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

  // Sort the transactions based on their timestamp in descending order
  return uniqueTransactions.sort((m1, m2) => Date.parse(m2.timestamp) - Date.parse(m1.timestamp));
};

/**
 * Hook that allows to retrieve the past actions of a user querying them from the GraphQL server.
 */
const usePastTransactions = (address: string, transactionsPerPage: number = 50) => {
  // Get the pending transactions for the user
  const pendingTransactions = usePendingTransactions(address);
  const pendingMessages = pendingTransactions.flatMap(convertPendingTransaction);
  const syncPendingTransaction = useUpdatePendingTransactions();

  // Set the pending transactions as the current value of the transactions
  const [remoteMessages, setRemoteMessages] = React.useState<PastTransactionMessage[]>([]);
  const [fetchingMore, setFetchingMore] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);

  // Merge the pending transactions with the transactions from the chain
  const transactions = React.useMemo(() => {
    return mergeTransactions(remoteMessages, pendingMessages);
  }, [remoteMessages, pendingMessages]);

  // Callback to be called when the query is completed
  const onCompletedCallback = React.useCallback(
    (data: any) => {
      if (!data) return;

      const onChainMessages = (data.messages as any[]).map(convertGraphQLTransactionMessage);
      syncPendingTransaction(onChainMessages);
      setRemoteMessages(onChainMessages);
    },
    [syncPendingTransaction],
  );

  // Query the past transactions from the server
  const { loading, fetchMore, refetch } = useQuery(GetTransactionsByAddress, {
    variables: {
      address: `{${address}}`,
      limit: transactionsPerPage,
      offset: 0,
      types: '{}',
    },
    onCompleted: onCompletedCallback,
  });

  // Callback to fetch more transactions
  const fetchMoreTransactions = React.useCallback(async () => {
    try {
      setError(undefined);
      setFetchingMore(true);

      // Fetch more notifications
      await fetchMore({
        variables: { offset: remoteMessages.length },
        updateQuery: (prev, { fetchMoreResult }) => ({
          messages: fetchMoreResult ? [...prev.messages, ...fetchMoreResult.messages] : prev,
        }),
      });
    } catch (e: any) {
      setError(e.toString);
    } finally {
      // Make sure to set the fetching to false in any case
      setFetchingMore(false);
    }
  }, [fetchMore, remoteMessages.length]);

  // Callback to be called when the transactions list is refreshed
  const refetchTransactions = React.useCallback(async () => {
    try {
      setError(undefined);
      setRefreshing(true);

      // Get the new data by resetting the fetch offset to restart post fetching
      const { data } = await refetch({ offset: 0 });
      onCompletedCallback(data);
    } catch (e: any) {
      setError(e.toString());
    } finally {
      // Make sure to set the fetching to false in any case
      setRefreshing(false);
    }
  }, [onCompletedCallback, refetch]);

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
