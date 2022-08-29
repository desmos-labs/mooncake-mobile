import {Loadable} from 'recoil';
import {PaginatedData} from '.';

function getRowsFromLoadable(query: Loadable<PaginatedData<FollowersData>>) {
  const dedup = new Set<string>();
  return query
    .valueMaybe()
    ?.data.map(d => {
      if (dedup.has(d.dtag)) return undefined;
      dedup.add(d.dtag);
      return d;
    })
    .filter((d): d is FollowersData => d !== undefined);
}

export default getRowsFromLoadable;
