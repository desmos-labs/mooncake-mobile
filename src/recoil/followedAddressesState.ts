import {selector} from 'recoil';
import {followingState} from './following';

const followedAddressesState = selector({
  key: 'followedAddressesState',
  get: ({get}) => {
    const following = get(followingState);
    return following.reduce<Set<string>>((set, {address}) => {
      set.add(address);
      return set;
    }, new Set());
  },
});

export default followedAddressesState;
