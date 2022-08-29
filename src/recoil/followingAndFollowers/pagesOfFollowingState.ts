import {noWait, selector} from 'recoil';
import followingAndFollowers from '.';
import followingQuery from './followingQuery';
import getPages from './getPages';
import pageLimitOfFollowingState from './pageLimitOfFollowingState';

/* It's creating a selector that fetches the following accounts for a given page. */
const pagesOfFollowingState = selector<number[]>({
  key: 'pagesOfFollowingState',
  get:
    /* It's creating an array of `RecoilValue`s, each of which is a page of following accounts. */
    ({get}) =>
      getPages(get(pageLimitOfFollowingState), page => {
        const {subspaceID, userAddress, cacheKey} = get(followingAndFollowers);
        return get(
          noWait(followingQuery({subspaceID, userAddress, cacheKey, page})),
        );
      }),
  /* It's telling Recoil to evict the least recently used page of following accounts. */
  cachePolicy_UNSTABLE: {eviction: 'most-recent'},
});

export default pagesOfFollowingState;
