import { useQuery } from '@apollo/client';
import { convertGQLImpactPoints } from 'lib/GraphQLUtils';
import React from 'react';
import GetImpactPoints, { GQLImpactPoints } from 'services/graphql/queries/GetImpactPoints';

/**
 * Hook to fetch the invites created from the current active account.
 */
export default function useGetActiveAccountImpactPoints() {
  const { data, loading, refetch, error } = useQuery<GQLImpactPoints>(GetImpactPoints, {
    fetchPolicy: 'no-cache',
  });

  const impactPoints = React.useMemo(() => {
    return data !== undefined ? convertGQLImpactPoints(data) : undefined;
  }, [data]);

  return {
    impactPoints,
    loading,
    refetch,
    error,
  };
}
