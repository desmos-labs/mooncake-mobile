import {noWait, selectorFamily} from 'recoil';
import routeState from './routeState';
import {PAGINATION_LIMIT, StateType} from '.';
import queryState from './queryState';
import pageLimitState from './pageLimitState';

/* It's creating a selector that fetches the following accounts for a given page. */
const pagesState = selectorFamily<number[], StateType>({
  key: 'pagesState',
  /* It's creating an array of `RecoilValue`s, each of which is a page of following accounts. */
  get:
    stateType =>
    ({get}) => {
      const currentPageLimit = get(pageLimitState(stateType));
      const {subspaceID, userAddress, cacheKey} = get(routeState);
      const pages: number[] = [];
      for (let page = 1; page <= currentPageLimit; page++) {
        const query = queryState({
          stateType,
          subspaceID,
          userAddress,
          cacheKey,
          page,
        });
        /* Calling the query function with the page number. */
        const loadable = get(noWait(query));

        /* If the loadable is not in the `hasValue` state, then we push the current page number to the
        pages array and break out of the loop. */
        if (loadable.state !== 'hasValue') {
          pages.push(page);
          break;
        }

        /* Destructuring the data property from the loadable.getValue() object. */
        const {data} = loadable.getValue();

        /* If the data length is 0, then we break out of the loop. */
        if (data.length === 0) {
          break;
        }

        /* Pushing the current page number to the pages array. */
        pages.push(page);

        /* If the data length is less than the pagination limit, then we break out of the loop. */
        if (data.length < PAGINATION_LIMIT) {
          break;
        }
      }
      return pages;
    },
  /* It's telling Recoil to evict the least recently used page of following accounts. */
  cachePolicy_UNSTABLE: {eviction: 'most-recent'},
});

export default pagesState;
