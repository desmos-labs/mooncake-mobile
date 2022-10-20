import {atomFamily, useRecoilState} from 'recoil';

export enum POST_TYPE {
  'DISCOVER',
  'FOLLOWING',
}

const postsFamily = atomFamily<PostItem[], POST_TYPE>({
  key: 'posts',
  default: [],
});

export const usePostsFamily = (family: POST_TYPE) => {
  const [posts, setPosts] = useRecoilState(postsFamily(family));

  return {
    posts,
    setPosts,
  };
};
