import { Post } from 'types/posts';

/**
 * Hook that allows to get the count of the comments of a post.
 * @param post {Post} - The post for which to get the count of the comments.
 *
 * TODO: Implement this similarly to {@link useReactionsCount}.
 */
const useCommentsCount = (post: Post) => {
  return {
    count: 0,
    refetch: () => {},
  };
};

export default useCommentsCount;
