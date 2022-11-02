import {atom, selector} from 'recoil';

// eslint-disable-next-line import/prefer-default-export
export const pendingPostsState = atom<PendingPost[]>({
  key: 'pendingPosts',
  default: [],
});

export const hasPendingPosts = selector<boolean>({
  key: 'hasPendingPosts',
  get: ({get}) => {
    return get(pendingPostsState).length > 0;
  },
});
