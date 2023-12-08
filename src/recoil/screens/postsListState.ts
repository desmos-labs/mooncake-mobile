import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

type PostsListState = {
  scrollToTop: boolean;
  searchBarFocused: boolean;
  valueToSearch: string;
};

const DefaultListOptions: PostsListState = {
  scrollToTop: false,
  searchBarFocused: false,
  valueToSearch: '',
};

/**
 * Atom that holds the current state of the posts list.
 */
const postsListState = atom<PostsListState>({
  key: 'postsListState',
  default: DefaultListOptions,
});

/**
 * Hook that allows to edit the current posts list state.
 */
export const useSetPostsListState = () => useSetRecoilState(postsListState);

/**
 * Hook that allows to get the current posts list state.
 */
export const usePostsListState = () => useRecoilValue(postsListState);
