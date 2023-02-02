import { atom, selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil';
import { PostsParams, ProfileParams } from 'types/desmos';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import React from 'react';

interface DesmosParams {
  readonly profiles: ProfileParams;
  readonly posts: PostsParams;
}

const DefaultParams: DesmosParams = {
  profiles: {
    bio: {
      maxLength: 1000,
    },
    dTag: {
      regEx: '^[A-Za-z0-9_]+$',
      maxLength: 30,
      minLength: 6,
    },
    nickname: {
      maxLength: 1000,
      minLength: 2,
    },
  },
  posts: {
    maxTextLength: 500,
  },
};

const desmosParamsState = atom<DesmosParams>({
  key: 'profileParamsState',
  default: getMMKV(MMKVKEYS.DESMOS_CONFIG) ?? DefaultParams,
  effects: [
    ({ onSet }) => {
      onSet(params => {
        setMMKV(MMKVKEYS.DESMOS_CONFIG, params);
      });
    },
  ],
});

/**
 * Recoil that allows to select a single Desmos param value.
 */
const paramsState = selectorFamily({
  key: 'param',
  get:
    (key: keyof DesmosParams) =>
    ({ get }) => {
      const settings = get(desmosParamsState);
      return settings[key];
    },
});

/**
 * Hook that allows to observe only a single Desmos param value.
 * @param paramKey - Key associated to the params that need to be retrieved.
 * @return The value of the params associated with the given key.
 */
export const useDesmosParam = <K extends keyof DesmosParams>(paramKey: K) =>
  useRecoilValue(paramsState(paramKey)) as DesmosParams[K];

/**
 * Hook that provides a function to update the value of a Desmos params.
 * @param settingKey - Key of the params of interest.
 */
export const useSetDesmosParam = <K extends keyof DesmosParams>(settingKey: K) => {
  const setParams = useSetRecoilState(desmosParamsState);
  return React.useCallback(
    (setting: DesmosParams[K]) => {
      setParams(currentValue => {
        const settings: DesmosParams = {
          ...currentValue,
        };
        settings[settingKey] = setting;
        return settings;
      });
    },
    [settingKey, setParams],
  );
};
