import { useQuery } from '@apollo/client';
import GetInvites, { GqlInvites } from 'services/graphql/queries/GetInvites';
import { convertGQLInvite } from 'lib/GraphQLUtils';
import React from 'react';

/**
 * Hook to fetch the invites created from the current active account.
 */
const useInvites = () => {
  const { data, loading, refetch, error } = useQuery<GqlInvites>(GetInvites, {
    fetchPolicy: 'no-cache',
  });

  const invites = React.useMemo(() => {
    return data?.invite?.map(convertGQLInvite);
  }, [data]);

  return {
    invites,
    loading,
    refetch,
    error,
  };
};

export default useInvites;
