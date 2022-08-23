import React from 'react';
import {atom, useRecoilState} from 'recoil';
import GetConfig from 'services/axios/requests/GetConfig';

export interface ButterConfigState {
  // Desmos address of the account used by the APIs
  desmos_address: string;
}

/**
 * A recoil atom used to store the config details of the Butter app, retrieved
 * from API
 */
const butterConfigState = atom<ButterConfigState>({
  key: 'chainConfig',
  default: {
    desmos_address: '',
  },
});

const useButterConfig = () => {
  const [butterConfig, setButterConfig] = useRecoilState(butterConfigState);

  const updateButterConfig = React.useCallback(async () => {
    const _butterConfig = await GetConfig();

    setButterConfig(_butterConfig);
  }, [butterConfig]);

  return {
    updateButterConfig,
    butterConfig,
  };
};

export default useButterConfig;
