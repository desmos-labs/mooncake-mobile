import MooncakeJsonSerializer from 'lib/JsonSerializer';
import { MMKV } from 'react-native-mmkv';

const WCMMKV = new MMKV({
  id: 'wallet-connect-mmkv-id',
});

async function getEntries<T = any>(): Promise<[string, T][]> {
  return WCMMKV.getAllKeys().map(key => [
    key,
    MooncakeJsonSerializer.deserialize(WCMMKV.getString(key) ?? '{}'),
  ]);
}

async function getItem<T = any>(key: string): Promise<T | undefined> {
  const value = WCMMKV.getString(key);
  return value !== undefined ? MooncakeJsonSerializer.deserialize(value) : undefined;
}

async function getKeys(): Promise<string[]> {
  return WCMMKV.getAllKeys();
}

async function removeItem(key: string): Promise<void> {
  WCMMKV.delete(key);
}

async function setItem<T = any>(key: string, value: T): Promise<void> {
  WCMMKV.set(key, MooncakeJsonSerializer.serialize(value));
}

function clearAll() {
  WCMMKV.clearAll();
}

const WCMMKVStorage = {
  getEntries,
  getItem,
  getKeys,
  removeItem,
  setItem,
  clearAll,
};

export default WCMMKVStorage;
