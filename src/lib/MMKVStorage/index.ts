import {MMKV, useMMKVObject} from 'react-native-mmkv';
import EnvConfig from 'config/EnvConfig';

export enum MMKVKEYS {
  EXAMPLE_KEY = 'EXAMPLE_KEY',
  APP_SETTINGS = 'APP_SETTINGS',
  PROFILES = 'PROFILES',
  USER_OPTIONS = 'USER_OPTIONS',
  CONSENT_GIVEN = 'CONSENT_GIVEN',
  ACTIVE_ACCOUNT_ADDR = 'ACTIVE_ACCOUNT_ADDR',
  USE_BIOMETRICS = 'USE_BIOMETRICS',
  PENDING_POSTS = 'PENDING_POSTS',
  PENDING_COMMENTS = 'PENDING_COMMENTS',

  // REST API
  REST_AUTH_TOKEN = 'REST_AUTH_TOKEN',
  REST_REFRESH_TOKEN = 'REST_REFRESH_TOKEN',

  // OPTIMISTIC UI
  OPTIMISTIC_RELATIONSHIPS = 'OPTIMISTIC_RELATIONSHIPS',
}

const MMKVStorage = new MMKV({
  id: EnvConfig.MMKV_ID,
});

/**
 * Retrieve a value from MMKV and attempts to parse it into a json value.
 * If invalid, it will return undefined or the stored raw value.
 */
export const getMMKV = <T>(key: MMKVKEYS): T | undefined => {
  const mmkvValue = MMKVStorage.getString(key);

  if (!mmkvValue) return undefined;
  try {
    return JSON.parse(mmkvValue);
  } catch (err: any) {
    console.log(err);
    throw new Error(err.message);
  }
};

/**
 * Stringifies a value and writes it to a given MMKV key
 */
export const setMMKV = (key: MMKVKEYS, value: any) =>
  MMKVStorage.set(key, JSON.stringify(value));

/**
 * Clear the whole MMKV storage
 */
export const clearMMKV = () => MMKVStorage.clearAll();

/**
 * Delete a value from MMKV by key
 */
export const deleteMMKV = (key: MMKVKEYS) => MMKVStorage.delete(key);

/**
 * A hook that wraps useMMKVObject to enforce MMKVKEYS enum usage.
 */
export const useMMKVStorage = <T>(key: MMKVKEYS) => {
  return useMMKVObject<T>(key, MMKVStorage);
};
