import { DocumentNode, useLazyQuery as useApolloLazyQuery } from '@apollo/client';
import { OperationVariables } from '@apollo/client/core';
import { LazyQueryHookOptions, QueryResult } from '@apollo/client/react/types/types';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import React from 'react';

type CustomLazyQueryResultTuple<TData, TVariables extends OperationVariables> = [
  (
    opts?: Partial<LazyQueryHookOptions<TData, TVariables>> | undefined,
  ) => Promise<TData | undefined>,
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
    async (opts?: Partial<LazyQueryHookOptions<TData, TVariables>>): Promise<TData | undefined> => {
      return new Promise<TData | undefined>((resolve, reject) => {
        const extraOptions = opts || {};
        getData(extraOptions).then(data => {
          if (data.error) {
            reject(data.error);
          } else {
            resolve(data.data);
          }
        });
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
