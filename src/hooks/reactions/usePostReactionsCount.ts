import { useQuery } from '@apollo/client';
import GetPostReactionsCount from 'services/graphql/queries/GetPostReactionsCount';
import { Post } from 'types/posts';

/**
 * Hook that allows to get the count of reactions of a given post.
 * @param post {Post} - Post for which to get the reactions count.
 */
const usePostReactionsCount = (post: Pick<Post, 'subspaceId' | 'id'>) => {
  // Get the reactions count from the server
  const { data, loading, refetch } = useQuery(GetPostReactionsCount, {
    variables: {
      subspaceId: post.subspaceId,
      postId: post.id,
    },
  });

  return {
    count: data?.reactions?.aggregate?.count ?? 0,
    loading,
    refetch,
  };
};

export default usePostReactionsCount;
