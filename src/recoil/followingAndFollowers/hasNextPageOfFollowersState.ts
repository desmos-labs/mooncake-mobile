import {noWait, selector} from 'recoil';
import followingAndFollowers from '.';
import getHasNextPage from './getHasNextPage';
import followersQuery from './followersQuery';
import pageLimitOfFollowersState from './pageLimitOfFollowersState';

const hasNextPageOfFollowersState = selector<boolean>({
  key: 'hasNextPageOfFollowers',
  get:
    /* It's creating an array of `RecoilValue`s, each of which is a page of followers. */
    ({get}) =>
      getHasNextPage(get(pageLimitOfFollowersState), page => {
        const {subspaceID, userAddress, cacheKey} = get(followingAndFollowers);
        return get(
          noWait(followersQuery({subspaceID, userAddress, cacheKey, page})),
        );
      }),
  /* It's telling Recoil to evict the least recently used page of followers. */
  cachePolicy_UNSTABLE: {eviction: 'most-recent'},
});

export default hasNextPageOfFollowersState;
