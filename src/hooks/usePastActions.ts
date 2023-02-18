import { PastTransactionMessage } from 'types/transactions';

/**
 * Hook that allows to retrieve the past actions of a user querying them from the GraphQL server.
 * TODO: Implement this
 */
const usePastActions = (address: string) => {
  return {
    actions: [] as PastTransactionMessage[],
    loading: false,
    fetchMore: () => {},
    fetchingMore: false,
    refetch: () => {},
    refreshing: false,
  };
};

export default usePastActions;
