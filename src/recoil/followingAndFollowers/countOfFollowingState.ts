import {noWait, selector} from 'recoil';
import followingAndFollowers from '.';
import getCount from './getCount';
import followingQuery from './followingQuery';
import pageLimitOfFollowingState from './pageLimitOfFollowingState';

/* It's creating a selector that fetches the count of following accounts and following accounts. */
const countOfFollowingState = selector<number>({
  key: 'countOfFollowingState',
  get:
    /* It's creating an array of `RecoilValue`s, each of which is a page of following. */
    ({get}) =>
      getCount(get(pageLimitOfFollowingState), page => {
        const {subspaceID, userAddress, cacheKey} = get(followingAndFollowers);
        return get(
          noWait(followingQuery({subspaceID, userAddress, cacheKey, page})),
        );
      }),
  /* It's telling Recoil to evict the least recently used page of following accounts. */
  cachePolicy_UNSTABLE: {eviction: 'most-recent'},
});

export default countOfFollowingState;
