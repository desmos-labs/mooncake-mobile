import { useActiveAccountAddress } from '@recoil/accounts';
import { useQuery } from '@apollo/client';
import GetRelationshipForAddress from 'services/graphql/queries/GetRelationshipForAddress';
import { useAppStateValue } from '@recoil/appState';
import React from 'react';
import { useCachedIsFollowingUser, useUpdateUserFollowersCache } from '@recoil/followers';

/**
 * Hook that allows to know if the current user is following a given user or not.
 */
const useIsFollowing = (counterparty: string) => {
  const subspaceId = useAppStateValue('subspaceId');
  const activeAddress = useActiveAccountAddress();

  const updateUserFollowers = useUpdateUserFollowersCache();
  const followingCounterparty = useCachedIsFollowingUser(activeAddress, counterparty);

  const onDataFetched = React.useCallback(
    (data: any) => {
      if (!activeAddress) {
        return;
      }
      const isFollowing = data?.relationships?.length > 0;
      updateUserFollowers(activeAddress, counterparty, isFollowing);
    },
    [activeAddress, counterparty, updateUserFollowers],
  );

  const { refetch, loading } = useQuery(GetRelationshipForAddress, {
    fetchPolicy: 'network-only',
    onCompleted: onDataFetched,
    variables: {
      subspaceId,
      userAddress: activeAddress,
      counterpartyAddress: counterparty,
    },
  });

  const wrappedRefetch = React.useCallback(async () => {
    const result = await refetch();
    onDataFetched(result.data);
    return result;
  }, [onDataFetched, refetch]);

  return {
    isFollowing: followingCounterparty,
    loading,
    refetch: wrappedRefetch,
  };
};

export default useIsFollowing;
