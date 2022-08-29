import {noWait, selector} from 'recoil';
import followingAndFollowers from '.';
import getCount from './getCount';
import followersQuery from './followersQuery';
import pageLimitOfFollowersState from './pageLimitOfFollowersState';

/* It's creating a selector that fetches the count of followers and followers. */
const countOfFollowersState = selector<number>({
  key: 'countOfFollowersState',
  get:
    /* It's creating an array of `RecoilValue`s, each of which is a page of followers. */
    ({get}) =>
      getCount(get(pageLimitOfFollowersState), page => {
        const {subspaceID, userAddress, cacheKey} = get(followingAndFollowers);
        return get(
          noWait(followersQuery({subspaceID, userAddress, cacheKey, page})),
        );
      }),
  /* It's telling Recoil to evict the least recently used page of followers. */
  cachePolicy_UNSTABLE: {eviction: 'most-recent'},
});

export default countOfFollowersState;
