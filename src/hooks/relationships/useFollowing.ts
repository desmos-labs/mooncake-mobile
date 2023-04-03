import React, { useState } from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useGetFollowageToSync } from '@recoil/relationships';
import { DataStatus } from 'types/cache';
import { useQuery } from '@apollo/client';
import GetAccountFollowing from 'services/graphql/queries/GetAccountFollowing';
import { useAppStateValue } from '@recoil/appState';
import { mergeCacheableData } from 'lib/CacheUtils';
import { convertGraphQLFollowedUser } from 'lib/GraphQLUtils/relationships';
import { areFollowedUsersEqual, FollowedUser } from 'types/relationships';
import useUpdatePendingRelationships from 'hooks/relationships/useUpdatePendingRelationships';
import { removeDuplicates } from 'lib/ProfileUtils';

/**
 * Hook that returns the list of the accounts that the user having the given address is following.
 * @param address {String  | undefined} - Address of the user for which to get the following list.
 * If this is `undefined`, the current application's user address will be used instead.
 * @param usersPerPage {number} - Number of users to be fetched per page.
 */
const useFollowing = (address?: string, usersPerPage: number = 50) => {
  const activeAccountAddress = useActiveAccountAddress();
  const userAddress = address ?? activeAccountAddress;
  if (!userAddress) {
    throw new Error('Cannot get the following list without valid address');
  }

  const subspaceId = useAppStateValue('subspaceId');
  const updatePendingRelationships = useUpdatePendingRelationships();

  // Get the relationships to sync
  const getFollowageToSync = useGetFollowageToSync();
  const relationshipsToSync = React.useMemo(() => {
    return getFollowageToSync(userAddress).filter(r => r.status === DataStatus.CREATED_LOCALLY);
  }, [getFollowageToSync, userAddress]);

  // Set the initial users to be the list of the relationships to sync
  const [users, setUsers] = useState<FollowedUser[]>(relationshipsToSync);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchingMore, setFetchingMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  // Callback that is used when some data is returned by the chain
  const onCompletedCallback = React.useCallback(
    (data: any) => {
      if (!data) return;

      const onChainUsers = data.following.map(convertGraphQLFollowedUser);

      // Update the users list
      setUsers(currentUsers => {
        const [merged, updates] = mergeCacheableData(
          currentUsers,
          onChainUsers,
          areFollowedUsersEqual,
        );

        // Update the pending relationships by deleting the ones that are now synced
        updatePendingRelationships(userAddress, updates);

        return merged;
      });
      setLoading(false);
      setFetchingMore(false);
      setRefreshing(false);
    },
    [updatePendingRelationships, userAddress],
  );

  // Query used to get the following list
  const { fetchMore, refetch } = useQuery(GetAccountFollowing, {
    variables: {
      subspaceId,
      userAddress,
      offset: 0,
      limit: usersPerPage,
    },
    onCompleted: onCompletedCallback,
    refetchWritePolicy: 'overwrite',
  });

  // Callback to be called to fetch more users
  const fetchMoreUsers = React.useCallback(async () => {
    try {
      setError(undefined);
      setFetchingMore(true);

      await fetchMore({
        variables: { offset: users.length },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          if (fetchMoreResult.following.length === 0) setFetchingMore(false);
          return {
            following: [...prev.following, ...fetchMoreResult.following],
          };
        },
      });
    } catch (e: any) {
      setFetchingMore(false);
      setError(e.toString());
    }
  }, [fetchMore, users.length]);

  // Callback to be called to refresh the list of users
  const refetchUsers = React.useCallback(async () => {
    try {
      setError(undefined);
      setRefreshing(true);

      // Get the new data by resetting the fetch offset to restart post fetching
      const { data } = await refetch({ offset: 0 });
      onCompletedCallback(data);
    } catch (e: any) {
      setRefreshing(false);
      setError(e.toString());
    }
  }, [onCompletedCallback, refetch]);

  return {
    // Make sure to remove duplicate following users if, for any reason, we have them
    following: removeDuplicates(users.map(value => value.user)),
    loading,
    fetchMore: fetchMoreUsers,
    fetchingMore,
    refetch: refetchUsers,
    refreshing,
    error,
  };
};

export default useFollowing;
