import React from 'react';
import { DocumentNode, useLazyQuery as useApolloLazyQuery } from '@apollo/client';
import { OperationVariables } from '@apollo/client/core';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { LazyQueryHookOptions } from '@apollo/client/react/types/types';

/**
 * Hook that wraps {@link useApolloLazyQuery} into a new {@link Promise} so that the result can be returned properly.
 */
const useCustomLazyQuery = <
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: LazyQueryHookOptions<TData, TVariables>,
) => {
  const [getData, { refetch, fetchMore }] = useApolloLazyQuery<TData, TVariables>(query, options);
  const getLazyData = React.useCallback(
    async (opts?: Partial<LazyQueryHookOptions<TData, TVariables>>): Promise<any | undefined> => {
      return new Promise((resolve, reject) => {
        const extraOptions = opts || {};
        getData({
          fetchPolicy: 'no-cache',
          onCompleted: resolve,
          onError: reject,
          ...extraOptions,
        });
      });
    },
    [getData],
  );

  return {
    getLazyData,
    fetchMore,
    refetch,
  };
};

export default useCustomLazyQuery;
