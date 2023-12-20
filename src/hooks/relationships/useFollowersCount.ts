import { useQuery } from '@apollo/client';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useAppStateValue } from '@recoil/appState';
import GetFollowersCount from 'services/graphql/queries/GetFollowersCount';

/**
 * Hook that returns the number of users that the user having the given address is being followed by.
 * @param address {String  | undefined} - Address of the user for which to get the followers count.
 * If this is `undefined`, the current application's user address will be used instead.
 */
const useFollowersCount = (address: string | undefined) => {
  const subspaceId = useAppStateValue('subspaceId');
  const activeAddress = useActiveAccountAddress();

  // Get the followers count from the server
  const { data, loading, refetch } = useQuery(GetFollowersCount, {
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

export default useFollowersCount;
