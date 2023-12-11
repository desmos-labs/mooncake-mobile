import React from 'react';
import { useLazyQuery } from '@apollo/client';
import { BlockedUser } from 'types/blockedRelationships';
import GetAccountBlocked from 'services/graphql/queries/GetAccountBlocked';
import { convertGraphQLBlockedUser } from 'lib/GraphQLUtils/relationships';
import { FetchDataFunction, usePaginatedData } from 'hooks/usePaginatedData';
import { useActiveAccountAddress } from '@recoil/accounts';

const useFetchUserBlocked = (address: string | undefined) => {
  const [fetchBlocked] = useLazyQuery(GetAccountBlocked);

  return React.useCallback<FetchDataFunction<BlockedUser>>(
    async (offset: number, limit: number) => {
      if (!address) {
        throw new Error('Cannot get the blocked list without an address.');
      }

      const { data, error } = await fetchBlocked({
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

      const blocked =
        data?.blocked?.map(({ user }: { user: any }) => convertGraphQLBlockedUser(user)) ?? [];

      return {
        data: blocked,
        endReached: blocked.length < limit,
      };
    },
    [address, fetchBlocked],
  );
};

/**
 * Hook that returns the list of the blocked accounts of a given address.
 * @param address {String  | undefined} - Address of the user for which to get the blocked list.
 * If this is `undefined`, the current application's user address will be used instead.
 * @param usersPerPage {number} - Number of users to be fetched per page.
 */
const useBlocked = (address?: string, usersPerPage: number = 50) => {
  const activeAccount = useActiveAccountAddress();
  const userAddress = address || activeAccount;

  return usePaginatedData(useFetchUserBlocked(userAddress), {
    itemsPerPage: usersPerPage,
    autoFetchFirstPage: true,
  });
};

export default useBlocked;
