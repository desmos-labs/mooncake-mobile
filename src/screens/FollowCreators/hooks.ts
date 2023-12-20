import { useApolloClient } from '@apollo/client';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useAppStateValue } from '@recoil/appState';
import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';
import { FetchDataFunction, usePaginatedData } from 'hooks/usePaginatedData';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';
import React from 'react';
import GetCreators from 'services/graphql/queries/GetCreators';
import GetFollowageCount, {
  GetFollowageCountGqlResponse,
} from 'services/graphql/queries/GetFollowageCount';
import GetFollowedProfileAddresses, {
  GetFollowedProfileAddressesGqlResponse,
} from 'services/graphql/queries/GetFollowedProfileAddresses';
import { DesmosProfile } from 'types/desmos';

/**
 * Extension of the {@link DesmosProfile} interface to have also a
 * followed filed that indicates if the current user is following this user.
 */
export type FollowedProfile = DesmosProfile & {
  /**
   * Tells if the current user is following this user.
   */
  readonly following: boolean;
};

/**
 * Hook that provides a list of {@link FollowedProfile} that can be used
 * in the usePaginatedData hook.
 */
const useFetchCreators = () => {
  const apolloClient = useApolloClient();
  const subspaceId = useAppStateValue('subspaceId');
  const activeAccountAddress = useActiveAccountAddress();

  return React.useCallback<FetchDataFunction<DesmosProfile>>(
    async (offset, limit) => {
      // Query a list of profiles.
      const { data, error } = await apolloClient.query<GetCreatorsGqlResponse>({
        query: GetCreators,
        fetchPolicy: 'network-only',
        variables: {
          offset,
          limit,
        },
      });

      // Rethrow the error so that the usePaginatedData hook can handle it.
      if (error) {
        throw error;
      }

      // Handle the case where no data is returned.
      const profiles = data?.profile || [];
      // Convert the GraphQL profiles to a DesmosProfile.
      const fetchedProfiles = profiles.map(convertGraphQLProfile);

      // Query to check which of the fetched profiles are followed
      // from the current user.
      const { data: followedProfilesData, error: followedError } =
        await apolloClient.query<GetFollowedProfileAddressesGqlResponse>({
          query: GetFollowedProfileAddresses,
          fetchPolicy: 'network-only',
          variables: {
            subspaceId,
            userAddress: activeAccountAddress,
            couterpartyAdresses: fetchedProfiles.map(profile => profile.address),
          },
        });

      // Rethrow the error so that the usePaginatedData hook can handle it.
      if (followedError) {
        throw followedError;
      }

      // Put the followed addresses in a set so we can easily check if
      // a profile is followed from the current user.
      const followedSet = new Set(
        followedProfilesData?.relationships?.map(
          relationship => relationship.counterpartyAddress,
        ) ?? [],
      );

      // Extend the fetched profiles with the following field.
      const followedProfiles = fetchedProfiles.map(profile => ({
        ...profile,
        following: followedSet.has(profile.address),
      }));

      return {
        data: followedProfiles,
        endReached: profiles.length < limit,
      };
    },
    [activeAccountAddress, apolloClient, subspaceId],
  );
};

/**
 * Hook that provides a list of {@link FollowedProfile} an the total number of users that
 * the current user is following.
 */
// Disable since in the future we may want to export other hooks.
export const useCreators = () => {
  const activeAccountAddress = useActiveAccountAddress();
  const subspaceId = useAppStateValue('subspaceId');

  // The number of users that the current user is following.
  const [followageCount, setFollowageCount] = React.useState(0);

  // Lazy query to fetch the total number of users that
  // the current user is following.
  const [getFollowageCount] = useCustomLazyQuery<GetFollowageCountGqlResponse>(GetFollowageCount, {
    fetchPolicy: 'network-only',
    variables: {
      subspaceId,
      userAddress: activeAccountAddress,
    },
  });

  const {
    data: creators,
    loading,
    fetchMore,
    refresh,
    refreshing,
    error,
  } = usePaginatedData(useFetchCreators(), {
    itemsPerPage: 20,
    onPreFetchPage: React.useCallback(
      // When fetching the first page fetch also the total number
      // of followed users.
      async (page: number) => {
        if (page === 0) {
          const followageCountResult = await getFollowageCount();
          setFollowageCount(followageCountResult.followers.aggregate.count);
        }
      },
      [getFollowageCount],
    ),
  });

  return {
    creators,
    loading,
    fetchMore,
    refresh,
    refreshing,
    followageCount,
    error,
  };
};
