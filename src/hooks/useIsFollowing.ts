import { useActiveAccountAddress } from '@recoil/wallets';
import { useQuery } from '@apollo/client';
import GetRelationshipForAddress from 'services/graphql/queries/GetRelationshipForAddress';
import {
  useAddFollowedUser,
  useHasFollowedUser,
  useRemoveFollowedUser,
} from '@recoil/relationships';
import React, { useMemo } from 'react';

/**
 * Hook that allows to know if the current user is following a given user or not.
 * Once the hook is called, a query to the GraphQL server is performed in order to get
 * the most up-to-date result. Once the result has been fetched, it's stored locally in order
 * to optimize later calls.
 */
const useIsFollowing = (counterparty: string) => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error(
      'Trying to know if the user is following another user, without an active account',
    );
  }

  const hasFollowedUser = useHasFollowedUser();
  const addFollowedUser = useAddFollowedUser();
  const removeFollowedUser = useRemoveFollowedUser();

  // This is the value that is going to be used as source-of-truth.
  // It's always retrieved from the local cache, which is updated as soon
  // as the server returns a valid response
  const isFollowing = useMemo(
    () => hasFollowedUser(activeAddress, counterparty),
    [hasFollowedUser, activeAddress, counterparty],
  );

  const { data, refetch } = useQuery(GetRelationshipForAddress, {
    fetchPolicy: 'cache-and-network',
    variables: {
      userAddress: activeAddress,
      counterpartyAddress: counterparty,
    },
  });

  // The following effect is used to react to updates of the data returned
  // by the query. The idea is to cache the response inside the Recoil atom,
  // so that we can simply read that value later on
  React.useEffect(() => {
    if (!data) {
      return;
    }

    const relationships = data.relationships as any[];
    const isCached = hasFollowedUser(activeAddress, counterparty);

    if (relationships.length > 0 && !isCached) {
      // If the relationship exists on the server but does not exist on the cache,
      // add it to the cache
      addFollowedUser(activeAddress, counterparty);
    }

    if (relationships.length === 0 && isCached) {
      // If the relationship does not exist on the server but exists on the cache,
      // delete it from the cache
      removeFollowedUser(activeAddress, counterparty);
    }
  }, [data, activeAddress, hasFollowedUser, addFollowedUser, removeFollowedUser]);

  return {
    isFollowing,
    refetch,
  };
};

export default useIsFollowing;
