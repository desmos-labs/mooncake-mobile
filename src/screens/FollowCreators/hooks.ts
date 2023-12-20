import { useApolloClient } from '@apollo/client';
import { FetchDataFunction, usePaginatedData } from 'hooks/usePaginatedData';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';
import React from 'react';
import GetCreators from 'services/graphql/queries/GetCreators';
import { DesmosProfile } from 'types/desmos';

const useFetchCreators = () => {
  const apolloClient = useApolloClient();

  return React.useCallback<FetchDataFunction<DesmosProfile>>(
    async (offset, limit) => {
      const { data, error } = await apolloClient.query<{ profile: DesmosProfile[] }>({
        query: GetCreators,
        variables: {
          offset,
          limit,
        },
      });

      // Rethrow the error so that the usePaginatedData hook can handle it.
      if (error) {
        throw error;
      }

      const profiles = data?.profile || [];
      return {
        data: profiles.map(convertGraphQLProfile),
        endReached: profiles.length < limit,
      };
    },
    [apolloClient],
  );
};

/**
 * Hook that provides the list of creators and the creators that the user is following.
 */
// Disable since in the future we may want to export other hooks.
// eslint-disable-next-line import/prefer-default-export
export const useCreators = () => {
  const {
    data: creators,
    loading: loadingCreators,
    fetchMore: fetchMoreCreators,
    refresh: refreshCreators,
    refreshing: refreshingCreators,
  } = usePaginatedData(useFetchCreators(), {
    itemsPerPage: 20,
    // Add some delay to make the loading animation visible.
    extraDelay: 250,
  });

  // Memoized loading status.
  const loading = React.useMemo(() => loadingCreators, [loadingCreators]);

  // Memoized refresh function.
  const refresh = React.useCallback(async () => {
    await refreshCreators();
  }, [refreshCreators]);

  // Memoized refreshing status.
  const refreshing = React.useMemo(() => refreshingCreators, [refreshingCreators]);

  return {
    creators,
    loading,
    fetchMore: fetchMoreCreators,
    refresh,
    refreshing,
  };
};
