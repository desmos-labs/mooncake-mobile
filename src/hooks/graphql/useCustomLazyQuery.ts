import React from 'react';
import { DocumentNode, useLazyQuery as useApolloLazyQuery } from '@apollo/client';
import { OperationVariables } from '@apollo/client/core';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { LazyQueryHookOptions } from '@apollo/client/react/types/types';

/**
 * Hook that wraps {@link useApolloLazyQuery} into a new {@link Promise} so that the result can be returned properly.
 */
const useCustomLazyQuery = <TData = any, TVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: LazyQueryHookOptions<TData, TVariables>,
) => {
  const [getData] = useApolloLazyQuery<TData, TVariables>(query, options);
  return React.useCallback(
    async (variables: TVariables): Promise<any | undefined> => {
      return new Promise((resolve, reject) => {
        getData({
          variables,
          fetchPolicy: 'no-cache',
          onCompleted: resolve,
          onError: reject,
        });
      });
    },
    [getData],
  );
};

export default useCustomLazyQuery;
