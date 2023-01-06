import {atom} from 'recoil';

const postsListScrollToTop = atom<boolean>({
  key: 'posts',
  default: false,
});

export default postsListScrollToTop;
