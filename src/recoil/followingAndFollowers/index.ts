import {atom} from 'recoil';

/* It's setting the limit of the number of items to be fetched. */
export const PAGINATION_LIMIT = 100;

/**
 * @property {number} subspaceID - The subspace ID of the app.
 * @property {string} userAddress - The address of the user whose following and followers you want to
 * fetch.
 * @property {string} cacheKey - Passing the diff cacheKey from upstream will load data without cache.
 */
export type FollowingAndFollowersState = {
  subspaceID: number;
  userAddress: string;
  cacheKey: string;
};

/**
 * @property {T[]} data - The actual data that we want to display.
 * @property {number} count - The total number of records in the database.
 */
export type PaginatedData<T> = {
  data: T[];
  count: number;
};

/**
 * @property {number} subspaceID - The ID of the subspace you want to query.
 * @property {string} userAddress - The address of the user who is viewing the page.
 * @property {string} cacheKey - This is the key that will be used to store the data in the cache.
 * @property {number} page - The page number of the results to return.
 */
export type QueryParam = {
  subspaceID: number;
  userAddress: string;
  cacheKey: string;
  page: number;
};

/* The state of the following and followers screen. */
const followingAndFollowersState = atom<FollowingAndFollowersState>({
  key: 'followingAndFollowers',
  default: {subspaceID: 0, userAddress: '', cacheKey: ''},
});

export default followingAndFollowersState;
