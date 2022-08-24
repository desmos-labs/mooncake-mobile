import React from 'react';
import {atom, useRecoilState} from 'recoil';
import {useLazyQuery} from '@apollo/client';
import GetProfileParams from 'services/graphql/queries/GetProfileParams';

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

// TODO: refactor this into a useProfileParams and useInitializeProfileParams hooks
export const useGetProfileParams = () => {
  const [params, setParams] = useRecoilState(profileParamsState);

  const [getProfileParams, {data}] = useLazyQuery(GetProfileParams);

  React.useEffect(() => {
    getProfileParams();
  }, []);

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
