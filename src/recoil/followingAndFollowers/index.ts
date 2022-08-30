/* It's setting the limit of the number of items to be fetched. */
export const PAGINATION_LIMIT = 100;

export type StateType = 'following' | 'followers';

/**
 * @property {T[]} data - The actual data that we want to display.
 * @property {number} count - The total number of records in the database.
 */
export type PaginatedData<T> = {
  data: T[];
  count: number;
};

/**
 * @property {string} type - 'following' or 'followers'.
 * @property {number} subspaceID - The ID of the subspace you want to query.
 * @property {string} userAddress - The address of the user who is viewing the page.
 * @property {string} cacheKey - This is the key that will be used to store the data in the cache.
 * @property {number} page - The page number of the results to return.
 */
export type QueryParam = {
  stateType: StateType;
  subspaceID: number;
  userAddress: string;
  cacheKey: string;
  page: number;
};
