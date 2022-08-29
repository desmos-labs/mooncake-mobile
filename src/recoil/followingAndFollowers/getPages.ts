import {Loadable} from 'recoil';
import {PaginatedData, PAGINATION_LIMIT} from '.';

function getPages<T>(
  currentPageLimit: number,
  query: (page: number) => Loadable<PaginatedData<T>>,
) {
  const pages: number[] = [];
  for (let page = 1; page <= currentPageLimit; page++) {
    const loadable = query(page);
    if (loadable.state !== 'hasValue') {
      pages.push(page);
      break;
    }
    const {data} = loadable.getValue();
    if (data.length === 0) {
      break;
    }
    pages.push(page);
    if (data.length < PAGINATION_LIMIT) {
      break;
    }
  }
  return pages;
}

export default getPages;
