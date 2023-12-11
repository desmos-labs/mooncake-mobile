import { useActiveAccountAddress } from '@recoil/accounts';
import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import GetFollowageCount from 'services/graphql/queries/GetFollowageCount';
import { useGetFollowageDifference } from '@recoil/relationships';
import { useAppStateValue } from '@recoil/appState';

/**
 * Hook that returns the number of accounts that the user having the given address is following.
 * @param address {String  | undefined} - Address of the user for which to get the followage count.
 * If this is `undefined`, the current application's user address will be used instead.
 */
const useFollowingCount = (address: string | undefined) => {
  const subspaceId = useAppStateValue('subspaceId');
  const activeAddress = useActiveAccountAddress();
  const userAddress: string | undefined = useMemo(
    () => address ?? activeAddress,
    [address, activeAddress],
  );
  if (!userAddress) {
    throw new Error('Cannot get followage count for undefined users address');
  }

  // Get the followage count from the server
  const { data, loading, refetch } = useQuery(GetFollowageCount, {
    variables: { subspaceId, userAddress },
  });
  const serverFollowageCount = useMemo(() => data?.followers?.aggregate?.count ?? 0, [data]);

  // Get the followage difference that is stored locally
  const getFollowageDifference = useGetFollowageDifference(userAddress);
  const followageDifference = useMemo(() => getFollowageDifference(), [getFollowageDifference]);

  // Computed the overall followage count by adding to the server count the local difference
  const followageCount = useMemo(
    () => Math.max(0, serverFollowageCount + followageDifference),
    [serverFollowageCount, followageDifference],
  );

  return {
    count: followageCount,
    loading,
    refetch,
  };
};

export default useFollowingCount;
