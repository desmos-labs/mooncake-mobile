import {noWait, selector} from 'recoil';
import followingAndFollowers from '.';
import followersQuery from './followersQuery';
import getPages from './getPages';
import pageLimitOfFollowersState from './pageLimitOfFollowersState';

/* It's creating a selector that fetches the followers for a given page. */
const pagesOfFollowersState = selector<number[]>({
  key: 'pagesOfFollowersState',
  get:
    /* It's creating an array of `RecoilValue`s, each of which is a page of followers. */
    ({get}) =>
      getPages(get(pageLimitOfFollowersState), page => {
        const {subspaceID, userAddress, cacheKey} = get(followingAndFollowers);
        return get(
          noWait(followersQuery({subspaceID, userAddress, cacheKey, page})),
        );
      }),
  /* It's telling Recoil to evict the least recently used page of followers. */
  cachePolicy_UNSTABLE: {eviction: 'most-recent'},
});

export default pagesOfFollowersState;
