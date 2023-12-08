import React from 'react';
import { DocumentNode, useLazyQuery as useApolloLazyQuery } from '@apollo/client';
import { OperationVariables } from '@apollo/client/core';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { LazyQueryHookOptions, QueryResult } from '@apollo/client/react/types/types';

type CustomLazyQueryResultTuple<TData, TVariables extends OperationVariables> = [
  (opts?: Partial<LazyQueryHookOptions<TData, TVariables>> | undefined) => Promise<any>,
  Pick<QueryResult<TData, TVariables>, 'fetchMore' | 'refetch'>,
];

/**
 * Hook that wraps {@link useApolloLazyQuery} into a new {@link Promise} so that the result can be returned properly.
 */
const useCustomLazyQuery = <
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: LazyQueryHookOptions<TData, TVariables>,
): CustomLazyQueryResultTuple<TData, TVariables> => {
  const [getData, { refetch, fetchMore }] = useApolloLazyQuery<TData, TVariables>(query, options);
  const getLazyData = React.useCallback(
    async (opts?: Partial<LazyQueryHookOptions<TData, TVariables>>): Promise<any | undefined> => {
      return new Promise((resolve, reject) => {
        const extraOptions = opts || {};
        extraOptions.onCompleted = resolve;
        extraOptions.onError = reject;
        getData(extraOptions);
      });
    },
    [getData],
  );

  return [
    getLazyData,
    {
      fetchMore,
      refetch,
    },
  ];
};

export default useCustomLazyQuery;
