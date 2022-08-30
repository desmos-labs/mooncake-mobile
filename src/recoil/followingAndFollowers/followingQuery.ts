import {selectorFamily} from 'recoil';
import GetFollowers from 'services/graphql/queries/GetFollowers';
import {QueryParam, PaginatedData} from '.';
import getQueryData from './getQueryData';

/* It's creating a selector that fetches the following accounts for a given page. */
const followingQuery = selectorFamily<PaginatedData<FollowersData>, QueryParam>(
  {
    key: 'followingQuery',
    get: ({subspaceID, userAddress, page}) =>
      getQueryData(GetFollowers, subspaceID, userAddress, page),
    cachePolicy_UNSTABLE: {eviction: 'lru', maxSize: 100},
  },
);

export default followingQuery;
