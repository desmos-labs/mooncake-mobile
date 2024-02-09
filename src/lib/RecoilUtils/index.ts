import { useCallback } from 'react';
import { RecoilState, useSetRecoilState } from 'recoil';

/**
 * Hook that provides a function to update an item stored in the {@link Record} held in the Recoil state.
 * @param atom - the Recoil state to update.
 * @param key - the key of the item to update.
 * @param defaultValue - the default value to use if the record doesn't contain an item for the provided key.
 */
export function useSetRecoilRecordItem<K extends string | number | symbol, V>(
  atom: RecoilState<Record<K, V>>,
  key: K,
  defaultValue: V,
) {
  const setRecoilRecordItem = useSetRecoilRecordItemWithKey(atom, defaultValue);

  return useCallback(
    (valOrUpdater: V | ((currentValue: V) => V)) => {
      setRecoilRecordItem(key, valOrUpdater);
    },
    [key, setRecoilRecordItem],
  );
}

/**
 * Hook that provides a function to update the items stored in the {@link Record} held in the Recoil state.
 * @param atom - the Recoil state to update.
 * @param defaultValue - the default value to use if the record doesn't contain an item for the provided key.
 */
export function useSetRecoilRecordItemWithKey<K extends string | number | symbol, V>(
  atom: RecoilState<Record<K, V>>,
  defaultValue: V,
) {
  const setRecord = useSetRecoilState(atom);

  return useCallback(
    (key: K, valOrUpdater: V | ((currentValue: V) => V)) => {
      setRecord(currentValue => {
        const currentItem = currentValue[key] ?? defaultValue;
        let newValue;
        if (typeof valOrUpdater === 'function') {
          // @ts-ignore
          newValue = valOrUpdater(currentItem);
        } else {
          newValue = valOrUpdater;
        }

        if (newValue === undefined || newValue === currentItem || newValue === defaultValue) {
          return currentValue;
        }
        return {
          ...currentValue,
          [key]: newValue,
        };
      });
    },
    // Safe to ignore, we don't want to update the callback if the
    // default value changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setRecord],
  );
}
