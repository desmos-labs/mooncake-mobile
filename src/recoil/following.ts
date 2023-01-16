import {atom, selector, selectorFamily} from 'recoil';

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
