import React, { useState } from 'react';
import { DesmosProfile } from 'types/desmos';
import GetAccountFollowers from 'services/graphql/queries/GetAccountFollowers';
import { useQuery } from '@apollo/client';
import { useAppStateValue } from '@recoil/appState';
import { useActiveAccountAddress } from '@recoil/accounts';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';

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
  const [fetchingMore, setFetchingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  // Callback to be called when the followers list is fetched
  const onCompletedCallback = React.useCallback((data: any) => {
    if (!data) return;

    const profiles = data.relationships
      .map((relationship: any) => relationship.creator)
      .map(convertGraphQLProfile);
    setFollowers(profiles);
  }, []);

  // Query the followers list
  const { loading, fetchMore, refetch } = useQuery(GetAccountFollowers, {
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
        updateQuery: (prev, { fetchMoreResult }) => ({
          relationships: fetchMoreResult
            ? [...prev.relationships, ...fetchMoreResult.relationships]
            : prev,
        }),
      });
    } catch (e: any) {
      setError(e.toString);
    } finally {
      // Make sure to set the fetching to false in any case
      setFetchingMore(false);
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
      setError(e.toString());
    } finally {
      // Make sure to set the fetching to false in any case
      setRefreshing(false);
    }
  }, [onCompletedCallback, refetch]);

  return {
    followers: [] as DesmosProfile[],
    loading,
    fetchMore: fetchMoreFollowers,
    fetchingMore,
    refetch: refetchFollowers,
    refreshing,
    error,
  };
};

export default useFollowers;
