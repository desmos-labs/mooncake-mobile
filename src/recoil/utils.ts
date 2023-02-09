import Cache, { CacheableObject, Comparator } from 'types/cache';
import { getMMKV, MMKVKEYS } from 'lib/MMKVStorage';

/**
 * Transforms the data stored into MMKV into a {@link Record} of caches that can
 * later be used to perform operations.
 * @param key - Key used to store the data inside MMKV
 * @param comparator - Comparator function that should be used to instantiate the cache.
 */
export const mmkvValueToCache = <T extends CacheableObject, C extends Partial<T>>(
  key: MMKVKEYS,
  comparator: Comparator<C>,
): Record<string, Cache<T, C>> => {
  return Object.entries(getMMKV(key) ?? {}).reduce((previous, [key, values]) => {
    const reduced: Record<string, Cache<T, C>> = { ...previous };
    reduced[key] = new Cache(values, comparator);
    return reduced;
  }, {});
};

/**
 * Transforms the given {@param data} into a {@link Record} of plain objects that
 * can be written inside the MMKV storage.
 */
export const cacheToMMKV = <T extends CacheableObject, C extends Partial<T>>(
  data: Record<string, Cache<T, C>>,
): Record<string, T[]> => {
  return Object.entries(data).reduce((previous, [key, value]) => {
    const reduced: Record<string, T[]> = { ...previous };
    reduced[key] = value.readAll();
    return reduced;
  }, {});
};
