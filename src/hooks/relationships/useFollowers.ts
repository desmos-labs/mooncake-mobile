import { useActiveAccountAddress } from '@recoil/accounts';
import { useAppStateValue } from '@recoil/appState';
import usePaginatedQuery from 'hooks/usePaginatedQuery';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';
import { useCallback } from 'react';
import GetAccountFollowers from 'services/graphql/queries/GetAccountFollowers';
import { DesmosProfile } from 'types/desmos';

/**
 * Hook that returns the list of the accounts that are following the user having the given address.
 * @param address {String  | undefined} - Address of the user for which to get the followers list.
 * If this is `undefined`, the current application's user address will be used instead.
 * @param followersPerPage {number} - Number of followers to fetch per page.
 */
const useFollowers = (address?: string, followersPerPage: number = 50) => {
  const activeAccount = useActiveAccountAddress();
  const userAddress = address || activeAccount;

  const convertData = useCallback((data: any): DesmosProfile[] => {
    return (data?.relationships ?? []).map((relationship: any) =>
      convertGraphQLProfile(relationship.creator),
    );
  }, []);

  return usePaginatedQuery({
    query: GetAccountFollowers,
    queryOptions: {
      itemsPerPage: followersPerPage,
    },
    variables: {
      subspaceId: useAppStateValue('subspaceId'),
      userAddress,
    },
    convertData,
  });
};

export default useFollowers;
