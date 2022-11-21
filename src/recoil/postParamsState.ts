import {atom} from 'recoil';

type PostParams = {
  max_text_length: number;
};

// eslint-disable-next-line import/prefer-default-export
export const postParamsState = atom<PostParams>({
  key: 'postParams',
  default: {
    max_text_length: 500,
  },
});
