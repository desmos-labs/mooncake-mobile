import {Loadable} from 'recoil';
import {PaginatedData, PAGINATION_LIMIT} from '.';

/**
 * It find and return the `aggregate.count` from the last succeed API result.
 * @param {number} currentPageLimit - The current page limit of the query.
 * @param query - (page: number) => Loadable<PaginatedData<T>>
 * @returns A function that takes two arguments and returns a number.
 */
function getCount<T>(
  currentPageLimit: number,
  query: (page: number) => Loadable<PaginatedData<T>>,
) {
  let countVal = 0;
  for (let page = 1; page <= currentPageLimit; page++) {
    const loadable = query(page);
    if (loadable.state !== 'hasValue') {
      break;
    }
    const {data, count} = loadable.getValue();
    countVal = count;
    if (data.length < PAGINATION_LIMIT) {
      break;
    }
  }
  return countVal;
}

export default getCount;
