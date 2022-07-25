import React from 'react';
import {atom, useRecoilState, useRecoilValue} from 'recoil';
import {useQuery} from '@apollo/client';
import GetProfileParams from 'services/graphql/queries/GetProfileParams';
import appSettingsState from '@recoil/settings';

export const profileParamsState = atom<ProfileParams>({
  key: 'profileParams',
  default: {
    bio: {
      max_length: '1000',
    },
    dtag: {
      reg_ex: '^[A-Za-z0-9_]+$',
      max_length: '30',
      min_length: '3',
    },
    oracle: {
      ask_count: 5,
      min_count: 3,
      script_id: 32,
      fee_amount: [],
      execute_gas: 200000,
      prepare_gas: 50000,
    },
    nickname: {
      max_length: '1000',
      min_length: '2',
    },
  },
});

export const useGetProfileParams = () => {
  const appSettings = useRecoilValue(appSettingsState);
  const [params, setParams] = useRecoilState(profileParamsState);

  const {data} = useQuery(GetProfileParams, {
    skip: appSettings.dataInitialized,
  });

  React.useEffect(() => {
    if (data) {
      const {profiles_params} = data;

      const [first] = profiles_params;

      setParams(first.params);
    }
  }, [data]);

  return {
    profileParams: params,
  };
};
