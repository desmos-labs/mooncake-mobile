import {atom} from 'recoil';

/* It's creating a selector that fetches the following accounts for a given page. */

const pageLimitOfFollowingState = atom<number>({
  key: 'pageLimitOfFollowing',
  default: 1,
});

export default pageLimitOfFollowingState;
