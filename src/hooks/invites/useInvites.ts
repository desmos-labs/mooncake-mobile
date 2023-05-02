import { useQuery } from '@apollo/client';
import GetInvites, { GqlInvites } from 'services/graphql/queries/GetInvites';
import React from 'react';
import convertGQLInvite from 'lib/GraphQLUtils/invites';

/**
 * Hook to fetch the invites created from the current active account.
 */
const useInvites = () => {
  const { data, loading, refetch, error } = useQuery<GqlInvites>(GetInvites, {
    fetchPolicy: 'no-cache',
    onError: error1 => {
      console.log('error', error1);
    },
  });

  const invites = React.useMemo(() => {
    console.log('invites', data);
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
