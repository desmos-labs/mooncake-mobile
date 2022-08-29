import {atom} from 'recoil';

/* It's setting the limit of the number of items to be fetched. */
export const PAGINATION_LIMIT = 100;

/**
 * @property {string} userAddress - The user's address.
 * @property {string} cacheKey - Changing the cacheKey will reload the state.
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
 * @property {string} userAddress - The user's address.
 * @property {string} cacheKey - This is the key that will be used to store the data in the cache.
 * @property {number} page - The page number of the results to fetch.
 */
export type QueryParam = {
  subspaceID: number;
  userAddress: string;
  cacheKey: string;
  page: number;
};

/* Creating a state object. */
const followingAndFollowersState = atom<FollowingAndFollowersState>({
  key: 'followingAndFollowers',
  default: {subspaceID: 0, userAddress: '', cacheKey: ''},
});

export default followingAndFollowersState;
