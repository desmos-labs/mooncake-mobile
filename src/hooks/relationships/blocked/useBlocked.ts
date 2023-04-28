import React, { useState } from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import { DataStatus } from 'types/cache';
import { useQuery } from '@apollo/client';
import { useAppStateValue } from '@recoil/appState';
import { mergeCacheableData } from 'lib/CacheUtils';
import { convertGraphQLFollowedUser } from 'lib/GraphQLUtils/relationships';
import { areFollowedUsersEqual } from 'types/relationships';
import { removeDuplicates } from 'lib/ProfileUtils';
import useUpdatePendingBlockedRelationships from 'hooks/relationships/blocked/useUpdatePendingBlockedRelationships';
import { useGetBlockedToSync } from '@recoil/blockedRelationships';
import { BlockedUser } from 'types/blockedRelationships';
import GetAccountBlocked from 'services/graphql/queries/GetAccountBlocked';

/**
 * Hook that returns the list of the accounts that the user having the given address is following.
 * @param address {String  | undefined} - Address of the user for which to get the following list.
 * If this is `undefined`, the current application's user address will be used instead.
 * @param usersPerPage {number} - Number of users to be fetched per page.
 */
const useBlocked = (address?: string, usersPerPage: number = 50) => {
  const activeAccountAddress = useActiveAccountAddress();
  const userAddress = address ?? activeAccountAddress;
  if (!userAddress) {
    throw new Error('Cannot get the blocked list without valid address');
  }

  const subspaceId = useAppStateValue('subspaceId');
  const updatePendingBlockedRelationships = useUpdatePendingBlockedRelationships();

  // Get the relationships to sync
  const getBlockedToSync = useGetBlockedToSync();
  const blockedRelationshipsToSync = React.useMemo(() => {
    return getBlockedToSync(userAddress).filter(r => r.status === DataStatus.CREATED_LOCALLY);
  }, [getBlockedToSync, userAddress]);

  // Set the initial users to be the list of the relationships to sync
  const [users, setUsers] = useState<BlockedUser[]>(blockedRelationshipsToSync);
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
        updatePendingBlockedRelationships(userAddress, updates);

        return merged;
      });
      setLoading(false);
      setFetchingMore(false);
      setRefreshing(false);
    },
    [updatePendingBlockedRelationships, userAddress],
  );

  // Query used to get the following list
  const { fetchMore, refetch } = useQuery(GetAccountBlocked, {
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
          if (fetchMoreResult.blocked.length === 0) setFetchingMore(false);
          return {
            blocked: [...prev.blocked, ...fetchMoreResult.blocked],
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
    blocked: removeDuplicates(users.map(value => value.user)),
    loading,
    fetchMore: fetchMoreUsers,
    fetchingMore,
    refetch: refetchUsers,
    refreshing,
    error,
  };
};

export default useBlocked;
