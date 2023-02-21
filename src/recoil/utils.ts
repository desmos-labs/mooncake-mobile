import { CacheableObject, Comparator, MultipleUsersCache } from 'types/cache';
import { getMMKV, MMKVKEYS } from 'lib/MMKVStorage';

/**
 * Transforms the data stored into MMKV into a {@link Record} of caches that can
 * later be used to perform operations.
 * @param key - Key used to store the data inside MMKV
 * @param comparator - Comparator function that should be used to instantiate the cache.
 */
// It's fine to disable the next warning as we might add other methods in the future
// eslint-disable-next-line import/prefer-default-export
export const mmkvValueToCache = <T extends CacheableObject, C>(
  key: MMKVKEYS,
  comparator: Comparator<T, C>,
): MultipleUsersCache<T, C> => {
  return MultipleUsersCache.fromSerializedValues(
    (getMMKV(key) ?? {}) as Record<string, T[]>,
    comparator,
  );
};
