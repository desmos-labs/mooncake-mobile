import { useQuery } from '@apollo/client';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useAppStateValue } from '@recoil/appState';
import GetFollowageCount from 'services/graphql/queries/GetFollowageCount';

/**
 * Hook that returns the number of accounts that the user having the given address is following.
 * @param address {String  | undefined} - Address of the user for which to get the followage count.
 * If this is `undefined`, the current application's user address will be used instead.
 */
const useFollowingCount = (address: string | undefined) => {
  const subspaceId = useAppStateValue('subspaceId');
  const activeAddress = useActiveAccountAddress();

  // Get the followage count from the server
  const { data, loading, refetch } = useQuery(GetFollowageCount, {
    variables: {
      subspaceId,
      userAddress: address ?? activeAddress ?? '',
    },
  });

  return {
    count: data?.followers?.aggregate?.count ?? 0,
    loading,
    refetch,
  };
};

export default useFollowingCount;
