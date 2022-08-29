import {atom} from 'recoil';

/* the page limit will be increase when we scroll to the bottom of the FlatList and there is more pages to load from server. */
const pageLimitOfFollowersState = atom<number>({
  key: 'pageLimitOfFollowers',
  default: 1,
});

export default pageLimitOfFollowersState;
