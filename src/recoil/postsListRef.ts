import {atom} from 'recoil';

export type ListOptions = {
  scrollToTop: boolean;
  searchBarFocused: boolean;
};

export const DefaultListOptions = {
  scrollToTop: false,
  searchBarFocused: false,
};

const postsListOptions = atom<ListOptions>({
  key: 'posts',
  default: DefaultListOptions,
});

export default postsListOptions;
