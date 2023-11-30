import React from 'react';
import { RecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

/**
 * Hook that provides a function to update a specific propery of
 * a recoil state.
 * @param recoilState - The recoil state.
 * @param key - The key of the property to update.
 */
export const useSetRecoilStateProperty = <T extends {}, K extends keyof T>(
  recoilState: RecoilState<T>,
  key: K,
) => {
  const setRecoilState = useSetRecoilState(recoilState);

  return React.useCallback(
    (setterOrUpdater: ((current: T[K]) => T[K]) | T[K]) => {
      setRecoilState(oldState => {
        const oldValue = oldState[key];
        if (typeof setterOrUpdater === 'function') {
          // We have a setter function, lets call it to receive the new value.
          // @ts-ignore
          const newValue = setterOrUpdater(oldState[key]);

          if (oldValue !== newValue) {
            // The new value is different return the new state.
            return {
              ...oldState,
              [key]: newValue,
            };
          }
        } else if (oldValue !== setterOrUpdater) {
          // The new value is diffrent from the old one, return the new state.
          return {
            ...oldValue,
            [key]: setterOrUpdater,
          };
        }

        // Notting has changed keep the current state.
        return oldState;
      });
    },
    [key, setRecoilState],
  );
};

/**
 * This hook provides the value of a property held in a Recoil state.
 * @param recoilState - The Recoil state.
 * @param key - The key of the property to retrieve.
 */
export const useRecoilStateProperty = <T extends {}, K extends keyof T>(
  recoilState: RecoilState<T>,
  key: K,
) => {
  const recoilValue = useRecoilValue(recoilState);
  return React.useMemo(() => {
    return recoilValue[key];
  }, [recoilValue, key]);
};
