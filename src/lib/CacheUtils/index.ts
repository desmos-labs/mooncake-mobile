import { CacheableObject, Comparator, DataStatus } from 'types/cache';

const findSameDataIndex = <T extends CacheableObject, C extends Partial<T>>(
  existing: T[],
  data: T,
  comparator: Comparator<C>,
): number => {
  // It's fine to ignore the following warning, as C is always a Partial<T> by how we use it
  // @ts-ignore
  return existing.findIndex(value => comparator(value as C, data as C));
};

export enum CachedDataUpdateType {
  CREATED,
  UPDATED,
  DELETED,
}

export interface CachedDataUpdateCreated<T extends CacheableObject> {
  readonly type: CachedDataUpdateType.CREATED;
  readonly data: T;
}

export interface CachedDataUpdateUpdated<T extends CacheableObject> {
  readonly type: CachedDataUpdateType.UPDATED;
  readonly original: T;
  readonly updated: T;
}

export interface CachedDataUpdateDeleted<T extends CacheableObject> {
  readonly type: CachedDataUpdateType.DELETED;
  readonly data: T;
}

export type CachedDataUpdate<T extends CacheableObject> =
  | CachedDataUpdateCreated<T>
  | CachedDataUpdateUpdated<T>
  | CachedDataUpdateDeleted<T>;

/**
 * Merges the given sets of data, comparing them with the provided function when needed.
 * @param existing {[]T} - Set of data that already exists.
 * @param external {[]T} - Set of data fetched from an external source.
 * @param comparator {Function} - Function used to compare different elements of the data.
 * @return A new list of <code>T</code> that represents the merged data.
 */
export const mergeCacheableData = <T extends CacheableObject, C extends Partial<T>>(
  existing: T[],
  external: T[],
  comparator: Comparator<C>,
): [T[], CachedDataUpdate<T>[]] => {
  if (existing.length === 0) {
    return [external, []];
  }

  // Create the array to be stored.
  // This is copied so that if the object is frozen by someone (i.e. Recoil), we can still edit it
  let dataToStore = [...existing];
  const updates: CachedDataUpdate<T>[] = [];

  // First of all, update all the data that has either been edited or created
  external.forEach(data => {
    const cachedDataIndex = findSameDataIndex(existing, data, comparator);
    if (cachedDataIndex === -1) {
      // The data was not cached locally, it means it was created externally.
      // For this reason, just add it to the list of data to store
      updates.push({
        type: CachedDataUpdateType.CREATED,
        data,
      });
      dataToStore.push(data);
    } else {
      // The data was cached locally. We now need to act differently based on the
      // status that it has locally, and was has happened on the chain in the meanwhile
      const cachedData = existing[cachedDataIndex];
      switch (cachedData.status) {
        case DataStatus.CREATED_LOCALLY:
          // The data was created locally, and now it's on-chain.
          // Replace the local data with the new one from the chain
          updates.push({
            type: CachedDataUpdateType.UPDATED,
            original: dataToStore[cachedDataIndex],
            updated: data,
          });
          dataToStore[cachedDataIndex] = data;
          break;

        case DataStatus.DELETED_LOCALLY:
          // Ignore: this will be handled later
          break;
      }
    }
  });

  // Check the data that have been deleted locally.
  const deletedData = dataToStore.filter(d => d.status === DataStatus.DELETED_LOCALLY);
  deletedData.forEach((deletedItem, index) => {
    const updateDate = Date.parse(deletedItem.lastEdited);
    if (Date.now() - updateDate < 30 * 1000) {
      // If the data was updated locally less than 30 seconds ago, do nothing.
      // The operation might be still being carried out on-chain, or there might be some delays
      return;
    }

    // The data was updated more than 30 seconds ago, now we need to update the cache
    const onChainIndex = findSameDataIndex(external, deletedItem, comparator);
    switch (onChainIndex) {
      case -1:
        // The data is not found on chain: we can now safely remove it from the cache as well
        updates.push({
          type: CachedDataUpdateType.DELETED,
          data: deletedItem,
        });
        dataToStore = dataToStore.splice(index, 1);
        break;

      default:
        // The data is found on chain: we can revert the local changes by overriding them
        updates.push({
          type: CachedDataUpdateType.UPDATED,
          original: dataToStore[index],
          updated: external[onChainIndex],
        });
        dataToStore[index] = external[onChainIndex];
    }
  });

  return [dataToStore, updates];
};
