import React from 'react';
import { DesmosProfile } from 'types/desmos';
import GetAccountFollowers from 'services/graphql/queries/GetAccountFollowers';
import { useLazyQuery } from '@apollo/client';
import { useAppStateValue } from '@recoil/appState';
import { useActiveAccountAddress } from '@recoil/accounts';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';
import { FetchDataFunction, usePaginatedData } from 'hooks/usePaginatedData';

/**
 * Hook that provides a function that can be used inside the usePaginatedData
 * hook to fetch a user's followers.
 */
const useFetchUserFollowers = (address: string | undefined) => {
  const subspaceId = useAppStateValue('subspaceId');
  const [fetchFollowers] = useLazyQuery(GetAccountFollowers);

  return React.useCallback<FetchDataFunction<DesmosProfile>>(
    async (offset, limit) => {
      if (!address) {
        throw new Error('Cannot get the followers list without an address.');
      }

      const { data, error } = await fetchFollowers({
        fetchPolicy: 'no-cache',
        variables: {
          subspaceId,
          userAddress: address,
          offset,
          limit,
        },
      });

      if (error) {
        throw error;
      }

      const followers =
        data?.relationships?.map(({ creator }: { creator: any }) =>
          convertGraphQLProfile(creator),
        ) ?? [];

      return {
        data: followers,
        endReached: followers.length < limit,
      };
    },
    [fetchFollowers, address],
  );
};

/**
 * Hook that returns the list of the accounts that are following the user having the given address.
 * @param address {String  | undefined} - Address of the user for which to get the followers list.
 * If this is `undefined`, the current application's user address will be used instead.
 * @param followersPerPage {number} - Number of followers to fetch per page.
 */
const useFollowers = (address?: string, followersPerPage: number = 50) => {
  const activeAccount = useActiveAccountAddress();
  const userAddress = address || activeAccount;

  return usePaginatedData(useFetchUserFollowers(userAddress), {
    itemsPerPage: followersPerPage,
    autoFetchFirstPage: true,
  });
};

export default useFollowers;
