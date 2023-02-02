import { useActiveAccountAddress } from '@recoil/wallets';
import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import GetFollowersCount from 'services/graphql/queries/GetFollowersCount';

/**
 * Hook that returns the followers count for the user having the given address.
 * The followers count is defined as the number of users that are following the user with the given address.
 * @param address {String  | undefined} - Address of the user for which to get the followers count.
 * If this is `undefined`, the current application's user address will be used instead.
 */
const useFollowersCount = (address: string | undefined) => {
  const activeAddress = useActiveAccountAddress();
  const userAddress: string | undefined = useMemo(
    () => address ?? userAddress,
    [address, activeAddress],
  );
  if (!userAddress) {
    throw new Error('Cannot get followers count for undefined users address');
  }

  // Get the followers count from the server
  const { data, loading, refetch } = useQuery(GetFollowersCount, {
    variables: { userAddress },
  });
  const followersCount = useMemo(() => data?.followers?.aggregate?.count ?? 0, [data]);

  return {
    count: followersCount,
    loading,
    refetch,
  };
};

export default useFollowersCount;
