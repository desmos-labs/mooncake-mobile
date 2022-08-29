import {atom} from 'recoil';

/* It's creating a selector that fetches the following accounts for a given page. */

const pageLimitOfFollowersState = atom<number>({
  key: 'pageLimitOfFollowers',
  default: 1,
});

export default pageLimitOfFollowersState;
