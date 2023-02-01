import {MMKV, useMMKVObject} from 'react-native-mmkv';
import EnvConfig from 'config/EnvConfig';

export enum MMKVKEYS {
  // Application data
  APP_STATE = 'APP_STATE',
  APP_SETTINGS = 'APP_SETTINGS',
  BUTTER_CONFIG = 'BUTTER_CONFIG',
  DESMOS_CONFIG = 'DESMOS_CONFIG',

  // User data
  ACCOUNTS = 'ACCOUNTS',
  ACTIVE_ACCOUNT_ADDRESS = 'ACTIVE_ACCOUNT_ADDRESS',
  PROFILES = 'PROFILES',
  APPLICATION_LINKS = 'APPLICATION_LINKS',
  CHAIN_LINKS = 'CHAIN_LINKS',
  FOLLOWAGE = 'FOLLOWAGE',

  // Invite data
  INVITE_CODE = 'INVITE_CODE',

  // Posts data
  POST_REACTIONS = 'POST_REACTIONS',

  // Transactions data
  PENDING_TRANSACTIONS = 'PENDING_TRANSACTIONS',

  // REST APIs
  REST_AUTH_TOKEN = 'REST_AUTH_TOKEN',
}

const MMKVStorage = new MMKV({
  id: EnvConfig.MMKV_ID || 'butter',
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
