import {noWait, selectorFamily} from 'recoil';
import routeState from './routeState';
import {ITEMS_PER_FETCH, StateType} from '.';
import queryState from './queryState';
import pageLimitState from './pageLimitState';

/* It's creating a selector that fetches the count of following accounts and following accounts. */
const countState = selectorFamily<number, StateType>({
  key: 'countState',
  /* It's creating an array of `RecoilValue`s, each of which is a page of following. */
  get:
    stateType =>
    ({get}) => {
      const currentPageLimit = get(pageLimitState(stateType));
      const {subspaceID, userAddress, cacheKey} = get(routeState);

      let countVal = 0;
      for (let page = 1; page <= currentPageLimit; page++) {
        const query = queryState({
          stateType,
          subspaceID,
          userAddress,
          cacheKey,
          page,
        });
        const loadable = get(noWait(query));
        if (loadable.state !== 'hasValue') {
          break;
        }
        const {data, count} = loadable.getValue();
        countVal = count;
        if (data.length < ITEMS_PER_FETCH) {
          break;
        }
      }
      return countVal;
    },
});

export default countState;
