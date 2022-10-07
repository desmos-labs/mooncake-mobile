import React from 'react';
import {atom, selector, useRecoilState} from 'recoil';
import {useQuery} from '@apollo/client';
import GetFollowedUsersForAddress, {
  GetFollowedUsersForAddressData,
} from 'services/graphql/queries/GetFollowedUsersForAddress';
import useActiveAccount from 'hooks/useActiveAccount';
import usePendingRelationships from '@recoil/pendingTx/pendingRelationships';

export const followingState = atom<CounterParty[]>({
  key: 'following',
  default: [],
});

export const followedAddressesState = selector({
  key: 'followedAddressesState',
  get: ({get}) => {
    const following = get(followingState);
    return new Set(following.map(f => f.address));
  },
});

/**
 * Get the list of followed accounts for the active account
 */
export const useGetFollowing = () => {
  const {activeAddress} = useActiveAccount();
  const [following, setFollowing] = useRecoilState(followingState);
  const {syncPendingRelationships} = usePendingRelationships();

  const {data, loading} = useQuery<GetFollowedUsersForAddressData>(
    GetFollowedUsersForAddress,
    {
      variables: {
        userAddress: activeAddress,
      },
      pollInterval: 2000,
      fetchPolicy: 'no-cache',
    },
  );

  React.useEffect(() => {
    if (!data) return;
    const {user_relationship} = data;

    const newFollowing = user_relationship
      .map(x => x.counterparty)
      .filter(d => !!d);

    setFollowing(newFollowing);

    syncPendingRelationships(newFollowing.map(x => x.address));
  }, [data]);

  // refetch following list if userAddress has changed
  // React.useEffect(() => {
  //   refetch({userAddress: activeAddress});
  // }, [activeAddress]);

  return {
    following,
    loading,
  };
};
