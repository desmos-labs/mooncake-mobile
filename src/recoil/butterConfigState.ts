import React from 'react';
import {atom, useRecoilState, useSetRecoilState} from 'recoil';
import GetConfig from 'services/axios/requests/GetConfig';

export interface ButterConfigState {
  // Desmos address of the account used by the APIs
  desmos_address: string;
  ibc: any;
}

/**
 * A recoil atom used to store the config details of the Butter app, retrieved
 * from API
 */
const butterConfigState = atom<ButterConfigState>({
  key: 'chainConfig',
  default: {
    desmos_address: '',
    ibc: {},
  },
});

/**
 * A hook that exposes the butterConfig recoil state, as well as an update function
 * to manually update the atom.
 */
export const useButterConfig = () => {
  const [butterConfig, setButterConfig] = useRecoilState(butterConfigState);

  const updateButterConfig = React.useCallback(async () => {
    const _butterConfig = await GetConfig();
    setButterConfig(_butterConfig);
  }, []);

  return {
    updateButterConfig,
    butterConfig,
  };
};

export const useGetButterConfig = () => {
  const setButterConfig = useSetRecoilState(butterConfigState);

  const getButterConfig = React.useCallback(async () => {
    const _butterConfig = await GetConfig();

    setButterConfig(_butterConfig);
  }, []);

  return {
    getButterConfig,
  };
};
