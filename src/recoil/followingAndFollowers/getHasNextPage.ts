import {Loadable} from 'recoil';
import {PaginatedData, PAGINATION_LIMIT} from '.';

function getHasNextPage<T>(
  currentPageLimit: number,
  query: (page: number) => Loadable<PaginatedData<T>>,
) {
  for (let page = 1; page <= currentPageLimit; page++) {
    const loadable = query(page);
    if (loadable.state !== 'hasValue') {
      return false;
    }
    if (loadable.getValue().data.length < PAGINATION_LIMIT) {
      return false;
    }
  }
  return true;
}

export default getHasNextPage;
