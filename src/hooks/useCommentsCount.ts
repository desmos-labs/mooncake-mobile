import { Post } from 'types/posts';

const useCommentsCount = (post: Post) => {
  return {
    count: 0,
    refetch: () => {},
  };
};

export default useCommentsCount;
