import React from 'react';
import { useLazyQuery } from '@apollo/client';
import GetTransactionsCountByHash from 'services/graphql/queries/GetTransactionByHash';

/**
 * Hook that returns a function allowing to know if a transaction was successfully
 * included inside a block by searching its hash on the GraphQL server.
 */
const useIsTransactionBroadcast = () => {
  const [getTransactionsCount] = useLazyQuery(GetTransactionsCountByHash);

  return React.useCallback(
    async (txHash: string): Promise<boolean> => {
      const { data } = await getTransactionsCount({
        variables: { hash: txHash },
      });
      return data?.message_aggregate?.aggregate?.count > 0;
    },
    [getTransactionsCount],
  );
};

export default useIsTransactionBroadcast;
