import {Loadable} from 'recoil';
import {PaginatedData, PAGINATION_LIMIT} from '.';

/**
 * It takes a query function and a current page limit, and returns an array of page numbers that should
 * be fetched
 * @param {number} currentPageLimit - The maximum number of pages to fetch.
 * @param query - (page: number) => Loadable<PaginatedData<T>>
 * @returns An array of numbers.
 */
function getPages<T>(
  currentPageLimit: number,
  query: (page: number) => Loadable<PaginatedData<T>>,
) {
  const pages: number[] = [];
  for (let page = 1; page <= currentPageLimit; page++) {
    /* Calling the query function with the page number. */
    const loadable = query(page);

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
}

export default getPages;
