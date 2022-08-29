import {Loadable} from 'recoil';
import {PaginatedData, PAGINATION_LIMIT} from '.';

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
