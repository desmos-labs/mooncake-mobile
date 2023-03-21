import React, { useState } from 'react';
import { DesmosProfile } from 'types/desmos';
import GetAccountFollowers from 'services/graphql/queries/GetAccountFollowers';
import { useQuery } from '@apollo/client';
import { useAppStateValue } from '@recoil/appState';
import { useActiveAccountAddress } from '@recoil/accounts';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';
import { removeDuplicates } from 'lib/ProfileUtils';

/**
 * Hook that returns the list of the accounts that are following the user having the given address.
 * @param address {String  | undefined} - Address of the user for which to get the followers list.
 * If this is `undefined`, the current application's user address will be used instead.
 * @param followersPerPage {number} - Number of followers to fetch per page.
 */
const useFollowers = (address?: string, followersPerPage: number = 50) => {
  const activeAccount = useActiveAccountAddress();
  const userAddress = address || activeAccount;
  if (!userAddress) {
    throw new Error('Cannot get the followers list without an address.');
  }

  const subspaceId = useAppStateValue('subspaceId');

  const [followers, setFollowers] = useState<DesmosProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchingMore, setFetchingMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  // Callback to be called when the followers list is fetched
  const onCompletedCallback = React.useCallback((data: any) => {
    if (!data) return;

    const profiles = (data.relationships as any[]).map(r => r.creator).map(convertGraphQLProfile);
    setFollowers(profiles);
    setLoading(false);
    setFetchingMore(false);
    setRefreshing(false);
  }, []);

  // Query the followers list
  const { fetchMore, refetch } = useQuery(GetAccountFollowers, {
    variables: {
      subspaceId,
      userAddress,
      offset: 0,
      limit: followersPerPage,
    },
    onCompleted: onCompletedCallback,
    refetchWritePolicy: 'overwrite',
  });

  // Callback to be called to fetch more followers
  const fetchMoreFollowers = React.useCallback(async () => {
    try {
      setError(undefined);
      setFetchingMore(true);

      // Fetch more notifications
      await fetchMore({
        variables: { offset: followers.length },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          if (fetchMoreResult.relationships.length === 0) setFetchingMore(false);
          // Append the new followers to the existing ones
          return {
            relationships: [...prev.relationships, ...fetchMoreResult.relationships],
          };
        },
      });
    } catch (e: any) {
      setFetchingMore(false);
      setError(e.toString);
    }
  }, [fetchMore, followers.length]);

  // Callback to be called when the followers list is refreshed
  const refetchFollowers = React.useCallback(async () => {
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
    // Make sure to remove duplicate followers users if, for any reason, we have them
    followers: removeDuplicates(followers),
    loading,
    fetchMore: fetchMoreFollowers,
    fetchingMore,
    refetch: refetchFollowers,
    refreshing,
    error,
  };
};

export default useFollowers;
