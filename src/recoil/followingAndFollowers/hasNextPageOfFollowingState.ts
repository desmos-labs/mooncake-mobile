import {noWait, selector} from 'recoil';
import followingAndFollowing from '.';
import getHasNextPage from './getHasNextPage';
import followingQuery from './followingQuery';
import pageLimitOfFollowingState from './pageLimitOfFollowingState';

const hasNextPageOfFollowingState = selector<boolean>({
  key: 'hasNextPageOfFollowing',
  get:
    /* It's creating an array of `RecoilValue`s, each of which is a page of following accounts. */
    ({get}) =>
      getHasNextPage(get(pageLimitOfFollowingState), page => {
        const {subspaceID, userAddress, cacheKey} = get(followingAndFollowing);
        return get(
          noWait(followingQuery({subspaceID, userAddress, cacheKey, page})),
        );
      }),
  /* It's telling Recoil to evict the least recently used page of following accounts. */
  cachePolicy_UNSTABLE: {eviction: 'most-recent'},
});

export default hasNextPageOfFollowingState;
