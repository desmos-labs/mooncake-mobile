import {useMMKVObject} from 'react-native-mmkv';
import MMKVStorage from 'lib/MMKVStorage/index';

export enum MMKVKEYS {
  EXAMPLE_KEY = 'EXAMPLE_KEY',
}

/**
 * A hook that wraps useMMKVObject to enforce MMKVKEYS enum usage.
 */
const useMMKVStorage = <T>(key: MMKVKEYS) => {
  return useMMKVObject<T>(key, MMKVStorage);
};

export default useMMKVStorage;
