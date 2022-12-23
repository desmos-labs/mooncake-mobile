import {useCallback} from 'react';
import {atom, selector, selectorFamily, useSetRecoilState} from 'recoil';
import {useLazyQuery} from '@apollo/client';
import GetFollowedUsersForAddress, {
  GetFollowedUsersForAddressData,
} from 'services/graphql/queries/GetFollowedUsersForAddress';
import _ from 'lodash';

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

    const newFollowing = user_relationship.map(x => x.counterparty);

    setFollowing(_.compact(newFollowing));
  }, [address]);

  return {
    updateFollowing,
  };
};
