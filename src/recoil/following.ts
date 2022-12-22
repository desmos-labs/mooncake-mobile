import {useCallback, useEffect} from 'react';
import {
  atom,
  selector,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import {useLazyQuery, useQuery} from '@apollo/client';
import GetFollowedUsersForAddress, {
  GetFollowedUsersForAddressData,
} from 'services/graphql/queries/GetFollowedUsersForAddress';
import useActiveAccount from 'hooks/useActiveAccount';
import usePendingRelationships, {
  pendingRelationshipsState,
} from '@recoil/pendingTx/pendingRelationships';
import EnvConfig from 'config/EnvConfig';
import {
  hasOptimisticFollow,
  hasOptimisticUnfollow,
} from '@recoil/optimisticUI/optimisticRelationships';

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

export const isFollowingAddr = selectorFamily({
  key: 'isFollowingAddr',
  get:
    (address: string) =>
    ({get}) => {
      const hasOptFollow = get(hasOptimisticFollow(address));

      const hasOptUnfollow = get(hasOptimisticUnfollow(address));

      if (hasOptFollow) return true;
      if (hasOptUnfollow) return false;

      const followedAddresses = get(followedAddressesState);

      return followedAddresses.has(address);
    },
});

/**
 * A hook that exposes a function to manually update a user's following list.
 */
export const useGetFollowingForAddress = (address: string) => {
  const setFollowing = useSetRecoilState(followingState);

  const [, {refetch}] = useLazyQuery<GetFollowedUsersForAddressData>(
    GetFollowedUsersForAddress,
    {
      variables: {
        userAddress: address,
      },
      fetchPolicy: 'no-cache',
    },
  );

  const updateFollowing = useCallback(async () => {
    const {data} = await refetch({userAddress: address});
    const {user_relationship} = data;

    const newFollowing = user_relationship
      .map(x => x.counterparty)
      .filter(d => !!d);

    console.log('[useGetFollowingForAddress]: following updated');
    setFollowing(newFollowing);
  }, [address]);

  return {
    updateFollowing,
  };
};

/**
 * Get the list of followed accounts for the active account
 */
export const useGetFollowingPolling = () => {
  const {activeAddress} = useActiveAccount();
  const [, setFollowing] = useRecoilState(followingState);
  const {syncPendingRelationships} = usePendingRelationships();
  const pendingRelationships = useRecoilValue(pendingRelationshipsState);

  const {data, startPolling, stopPolling, refetch} =
    useQuery<GetFollowedUsersForAddressData>(GetFollowedUsersForAddress, {
      variables: {
        userAddress: activeAddress,
      },
      fetchPolicy: 'no-cache',
    });

  useEffect(() => {
    if (!data) return;
    const {user_relationship} = data;

    const newFollowing = user_relationship
      .map(x => x.counterparty)
      .filter(d => !!d);

    setFollowing(newFollowing);

    syncPendingRelationships(newFollowing.map(x => x.address));
  }, [JSON.stringify(data)]);

  useEffect(() => {
    if (activeAddress) {
      refetch({
        userAddress: activeAddress,
      });
    }
  }, [activeAddress]);

  useEffect(() => {
    if (pendingRelationships.length > 0) {
      startPolling(EnvConfig.POLLING_INTERVAL);
    } else {
      stopPolling();
    }
  }, [pendingRelationships.length]);
};
