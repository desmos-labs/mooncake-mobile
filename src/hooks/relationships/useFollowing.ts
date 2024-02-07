import { useActiveAccountAddress } from '@recoil/accounts';
import { useAppStateValue } from '@recoil/appState';
import { useSetCachedUserFollowing } from '@recoil/followers';
import usePaginatedQuery from 'hooks/usePaginatedQuery';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';
import React, { useCallback } from 'react';
import GetAccountFollowing from 'services/graphql/queries/GetAccountFollowing';
import { DesmosProfile } from 'types/desmos';

/**
 * Hook that returns the list of the accounts that the user having the given address is following.
 * @param address {String  | undefined} - Address of the user for which to get the following list.
 * If this is `undefined`, the current application's user address will be used instead.
 * @param usersPerPage {number} - Number of users to be fetched per page.
 */
const useFollowing = (address?: string, usersPerPage: number = 50) => {
  const activeAccount = useActiveAccountAddress();
  const userAddress = address || activeAccount;
  const setCachedFollowing = useSetCachedUserFollowing();

  const convertData = useCallback((data: any): DesmosProfile[] => {
    return (data?.following ?? []).map((relationship: any) =>
      convertGraphQLProfile(relationship.counterparty),
    );
  }, []);

  return usePaginatedQuery({
    query: GetAccountFollowing,
    queryOptions: {
      itemsPerPage: usersPerPage,
    },
    variables: {
      subspaceId: useAppStateValue('subspaceId'),
      userAddress,
    },
    convertData,
    onDataFetched: React.useCallback(
      (profiles: DesmosProfile[]) => {
        setCachedFollowing(
          userAddress,
          profiles.map(profile => profile.address),
        );
      },
      [setCachedFollowing, userAddress],
    ),
  });
};

export default useFollowing;
