import React from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useLazyQuery } from '@apollo/client';
import GetAccountFollowing from 'services/graphql/queries/GetAccountFollowing';
import { FetchDataFunction, usePaginatedData } from 'hooks/usePaginatedData';
import { DesmosProfile } from 'types/desmos';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';

/**
 * Hook that provides a function that can be used inside the usePaginatedData
 * hook to fetch a user's following list.
 */
const useFetchUserFollowing = (address: string | undefined) => {
  const [fetchFollowing] = useLazyQuery(GetAccountFollowing);

  return React.useCallback<FetchDataFunction<DesmosProfile>>(
    async (offset: number, limit: number) => {
      if (!address) {
        throw new Error('Cannot get the following list without an address.');
      }

      const { data, error } = await fetchFollowing({
        fetchPolicy: 'no-cache',
        variables: {
          userAddress: address,
          offset,
          limit,
        },
      });

      if (error) {
        throw error;
      }

      const following = (data?.following ?? []).map((relationship: any) =>
        convertGraphQLProfile(relationship.counterparty),
      );

      return {
        data: following,
        endReached: following.length < limit,
      };
    },
    [address, fetchFollowing],
  );
};

/**
 * Hook that returns the list of the accounts that the user having the given address is following.
 * @param address {String  | undefined} - Address of the user for which to get the following list.
 * If this is `undefined`, the current application's user address will be used instead.
 * @param usersPerPage {number} - Number of users to be fetched per page.
 */
const useFollowing = (address?: string, usersPerPage: number = 50) => {
  const activeAccount = useActiveAccountAddress();
  const userAddress = address || activeAccount;

  return usePaginatedData(useFetchUserFollowing(userAddress), {
    itemsPerPage: usersPerPage,
    autoFetchFirstPage: true,
  });
};

export default useFollowing;
