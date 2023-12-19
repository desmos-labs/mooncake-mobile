import { MMKV } from 'react-native-mmkv';
import { deserializeObject, serializeObject } from './encoding';

export enum MMKVKEYS {
  // Application data
  APP_STATE = 'APP_STATE',
  APP_SETTINGS = 'APP_SETTINGS',
  LOGIN_FLOW_STATE = 'LOGIN_FLOW_STATE',
  DESMOS_CONFIG = 'DESMOS_CONFIG',

  // User data
  ACCOUNTS = 'ACCOUNTS',
  ACTIVE_ACCOUNT_ADDRESS = 'ACTIVE_ACCOUNT_ADDRESS',
  PROFILES = 'PROFILES',

  // Posts data
  POSTS = 'POSTS',

  // Transactions data
  PENDING_TRANSACTIONS = 'PENDING_TRANSACTIONS',

  // Tour guide
  TOUR_GUIDE = 'TOUR_GUIDE',
}

const MMKVStorage = new MMKV({
  id: 'mooncake',
});

/**
 * Retrieve a value from MMKV and attempts to parse it into a json value.
 * If invalid, it will return undefined or the stored raw value.
 */
export const getMMKV = <T>(key: MMKVKEYS): T | undefined => {
  const mmkvValue = MMKVStorage.getString(key);

  if (!mmkvValue) {
    return undefined;
  }
  try {
    return deserializeObject(mmkvValue);
  } catch (err: any) {
    console.log(err);
    throw new Error(err.message);
  }
};

/**
 * Stringifies a value and writes it to a given MMKV key
 */
export const setMMKV = (key: MMKVKEYS, value: any) => MMKVStorage.set(key, serializeObject(value));

/**
 * Clear the whole MMKV storage
 */
export const clearMMKV = () => MMKVStorage.clearAll();

/**
 * Delete a value from MMKV by key
 */
export const deleteMMKV = (key: MMKVKEYS) => MMKVStorage.delete(key);
