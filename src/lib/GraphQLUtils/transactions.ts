import { PastTransactionMessage } from 'types/transactions';

/**
 * Converts the received past transactions from the GraphQL server into the format supported by the app.
 * @param data - The data received from the GraphQL server.
 */
// It's fine to disable the rule here, as we might want to export more functions in the future.
// eslint-disable-next-line import/prefer-default-export
export const convertGraphQLTransactionMessage = (data: any): PastTransactionMessage => {
  return {
    type: data.type,
    fees: data.fees,
    timestamp: data.timestamp,
    index: data.index,
    hash: data.transaction_hash,
  };
};
