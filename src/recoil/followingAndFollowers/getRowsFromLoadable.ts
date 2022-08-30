import {Loadable} from 'recoil';
import {PaginatedData} from '.';

/**
 * It takes a `Loadable<PaginatedData<FollowersData>>` and returns an array of `FollowersData` with
 * duplicates removed
 * @param query - Loadable<PaginatedData<FollowersData>>
 * @returns An array of FollowersData
 */
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
