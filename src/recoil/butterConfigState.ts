import {useLazyQuery} from '@apollo/client';
import React from 'react';
import {atom, useRecoilValue, useSetRecoilState} from 'recoil';
import GetConfig from 'services/graphql/queries/GetConfig';

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
  const butterConfig = useRecoilValue(butterConfigState);

  return {
    butterConfig,
  };
};

export const useGetButterConfig = () => {
  const setButterConfig = useSetRecoilState(butterConfigState);
  const [getConfigQuery] = useLazyQuery(GetConfig, {
    fetchPolicy: 'no-cache',
  });

  const getButterConfig = React.useCallback(async () => {
    await getConfigQuery().then(result => {
      if (result) {
        setButterConfig(result.data.config);
      }
    });
  }, []);

  return {
    getButterConfig,
  };
};
