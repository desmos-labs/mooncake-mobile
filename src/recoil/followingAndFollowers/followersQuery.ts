import {selectorFamily} from 'recoil';
import {GetFollowersForAddress} from 'services/graphql/queries/GetFollowingAndFollowers';
import {PaginatedData, QueryParam} from '.';
import getQueryData from './getQueryData';

/* It's creating a selector that fetches the followers for a given page. */
const followersQuery = selectorFamily<PaginatedData<FollowersData>, QueryParam>(
  {
    key: 'followersQuery',
    get: ({subspaceID, userAddress, page}) =>
      getQueryData(GetFollowersForAddress, subspaceID, userAddress, page),
    cachePolicy_UNSTABLE: {eviction: 'lru', maxSize: 100},
  },
);

export default followersQuery;
