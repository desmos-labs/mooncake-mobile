import React from 'react';
import { useLazyQuery } from '@apollo/client';
import GetAccountBlocked from 'services/graphql/queries/GetAccountBlocked';
import { FetchDataFunction, usePaginatedData } from 'hooks/usePaginatedData';
import { useActiveAccountAddress } from '@recoil/accounts';
import { DesmosProfile } from 'types/desmos';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';
import { useAppStateValue } from '@recoil/appState';

/**
 * Hook that returns a function that allows to fetch the list of the blocked users of a given address.
 * @param address {String  | undefined} - Address of the user for which to get the blocked list.
 */
const useFetchUserBlocked = (address: string | undefined) => {
  const [fetchBlocked] = useLazyQuery(GetAccountBlocked);
  const subspaceId = useAppStateValue('subspaceId');

  return React.useCallback<FetchDataFunction<DesmosProfile>>(
    async (offset: number, limit: number) => {
      if (!address) {
        return {
          data: [],
          endReached: true,
        };
      }

      const { data, error } = await fetchBlocked({
        fetchPolicy: 'no-cache',
        variables: {
          userAddress: address,
          subspaceId,
          offset,
          limit,
        },
      });

      if (error) {
        throw error;
      }

      const blocked = (data?.user_blocks ?? []).map((block: any) =>
        convertGraphQLProfile(block.blocked),
      );

      return {
        data: blocked,
        endReached: blocked.length < limit,
      };
    },
    [address, fetchBlocked, subspaceId],
  );
};

/**
 * Hook that returns the list of the blocked accounts of a given address.
 * @param address {String  | undefined} - Address of the user for which to get the blocked list.
 * If this is `undefined`, the current application's user address will be used instead.
 * @param usersPerPage {number} - Number of users to be fetched per page.
 */
const useBlockedUsers = (address?: string, usersPerPage: number = 50) => {
  const activeAccount = useActiveAccountAddress();
  const userAddress = address ?? activeAccount;

  return usePaginatedData(useFetchUserBlocked(userAddress), {
    itemsPerPage: usersPerPage,
    autoFetchFirstPage: true,
  });
};

export default useBlockedUsers;
