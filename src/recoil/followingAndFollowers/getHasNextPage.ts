import {Loadable} from 'recoil';
import {PaginatedData, PAGINATION_LIMIT} from '.';

/**
 * Return true if there are more pages to load, and we want to load them now.
 * @param {number} currentPageLimit - The current page limit.
 * @param query - (page: number) => Loadable<PaginatedData<T>>
 * @returns A boolean value.
 */
function getHasNextPage<T>(
  currentPageLimit: number,
  query: (page: number) => Loadable<PaginatedData<T>>,
) {
  for (let page = 1; page <= currentPageLimit; page++) {
    const loadable = query(page);

    /* If the loadable is not in the `hasValue` state, then we know that the previous API is still running. */
    if (loadable.state !== 'hasValue') {
      return false;
    }

    /* If the length of the data is less than the limit, then we know that we don't have any more data
    to load. */
    if (loadable.getValue().data.length < PAGINATION_LIMIT) {
      return false;
    }
  }
  return true;
}

export default getHasNextPage;
