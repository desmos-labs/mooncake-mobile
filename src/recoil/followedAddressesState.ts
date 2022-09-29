import {selector} from 'recoil';
import {followingState} from './following';

const followedAddressesState = selector({
  key: 'followedAddressesState',
  get: ({get}) => {
    const following = get(followingState);
    return new Set(following.map(f => f.address));
  },
});

export default followedAddressesState;
