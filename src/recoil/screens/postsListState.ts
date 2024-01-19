import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

type PostsListState = {
  searchBarFocused: boolean;
  scrollToTop: boolean;
};

const DefaultListOptions: PostsListState = {
  searchBarFocused: false,
  scrollToTop: false,
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
