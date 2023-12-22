import { useApolloClient } from '@apollo/client';
import { Relationships } from '@desmoslabs/desmjs';
import { MsgCreateRelationship } from '@desmoslabs/desmjs-types/desmos/relationships/v1/msgs';
import { MsgCreateRelationshipEncodeObject } from '@desmoslabs/desmjs/build/modules/relationships/v1';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useAppStateValue } from '@recoil/appState';
import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';
import useSignAndBroadcastTx from 'hooks/tx/useSignAndBroadcastTx';
import { FetchDataFunction, usePaginatedData } from 'hooks/usePaginatedData';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import GetCreators, { GetCreatorsGqlResponse } from 'services/graphql/queries/GetCreators';
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
const useFetchCreators = (userAddress: string) => {
  const apolloClient = useApolloClient();
  const subspaceId = useAppStateValue('subspaceId');

  return React.useCallback<FetchDataFunction<FollowedProfile>>(
    async (offset, limit) => {
      // Query a list of profiles.
      const { data, error } = await apolloClient.query<GetCreatorsGqlResponse>({
        query: GetCreators,
        fetchPolicy: 'no-cache',
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
      const counterpartyAddresses = fetchedProfiles.map(profile => profile.address);

      const { data: followedProfilesData, error: followedError } =
        await apolloClient.query<GetFollowedProfileAddressesGqlResponse>({
          query: GetFollowedProfileAddresses,
          fetchPolicy: 'no-cache',
          variables: {
            subspaceId,
            userAddress,
            counterpartyAddresses,
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
    [apolloClient, subspaceId, userAddress],
  );
};

/**
 * Hook that provides a list of {@link FollowedProfile} an the total number of users that
 * the current user is following.
 */
export const useCreators = () => {
  const userAddress = useActiveAccountAddress()!;
  const subspaceId = useAppStateValue('subspaceId');

  // The number of users that the current user is following.
  const [followageCount, setFollowageCount] = React.useState(0);

  // Lazy query to fetch the total number of users that
  // the current user is following.
  const [getFollowageCount] = useCustomLazyQuery<GetFollowageCountGqlResponse>(GetFollowageCount, {
    fetchPolicy: 'no-cache',
    variables: {
      subspaceId,
      userAddress,
    },
  });

  const {
    data: creators,
    loading,
    fetchMore,
    refresh,
    refreshing,
    error,
  } = usePaginatedData(useFetchCreators(userAddress), {
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

/**
 * Hook that provides a function to broadcast
 * the `MsgCreateRelationship` messages to follow the creators.
 */
export const useFollowCreators = (onDone: () => void) => {
  const { t } = useTranslation('onboarding');
  const broadcastTx = useSignAndBroadcastTx();
  const subspaceId = useAppStateValue('subspaceId');
  const activeAccountAddress = useActiveAccountAddress()!;

  const followCreators = React.useCallback(
    (creators: DesmosProfile[]) => {
      // List of MsgCreateRelationship to be broadcasted.
      const msgs = creators.map(c => {
        return {
          typeUrl: Relationships.v1.MsgCreateRelationshipTypeUrl,
          value: MsgCreateRelationship.fromPartial({
            counterparty: c.address,
            signer: activeAccountAddress,
            subspaceId,
          }),
        } as MsgCreateRelationshipEncodeObject;
      });

      broadcastTx(msgs, {
        onLoading: {
          popup: {
            description: t('following creator', { count: creators.length }),
          },
          action: () => {
            onDone();
          },
        },
        onSuccess: {
          popup: {
            title: t('follow success'),
            description: t('you are now following the selected creator', {
              count: creators.length,
            }),
          },
        },
        onError: {
          popup: {
            title: t('follow failed'),
            description: t('follow failed description', { count: creators.length }),
          },
        },
      });
    },
    [activeAccountAddress, broadcastTx, onDone, subspaceId, t],
  );

  return followCreators;
};
