import {atom} from 'recoil';

// eslint-disable-next-line import/prefer-default-export
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
