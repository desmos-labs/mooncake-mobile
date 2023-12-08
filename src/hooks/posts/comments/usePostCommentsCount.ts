import { Post } from 'types/posts';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import GetPostCommentsCount from 'services/graphql/queries/GetPostCommentsCount';
import { useGetPostCommentsDifference } from '@recoil/posts';

/**
 * Hook that allows to get the count of the comments of a post.
 * @param post {Post} - The post for which to get the count of the comments.
 * */
const usePostCommentsCount = (post: Pick<Post, 'subspaceId' | 'id'>) => {
  const address = useActiveAccountAddress();
  if (!address) {
    throw new Error("Trying to get a post's comments count, without an active address");
  }

  // Get the comments count from the server
  const { data, loading, refetch } = useQuery(GetPostCommentsCount, {
    variables: {
      postId: post.id,
    },
  });
  const serverCommentsCount = useMemo(() => data?.comments?.aggregate?.count ?? 0, [data]);

  // Get the comments difference that is stored locally
  const getCommentsDifference = useGetPostCommentsDifference(address);
  const commentsDifference = useMemo(
    () => getCommentsDifference(post.subspaceId, post.id),
    [getCommentsDifference, post],
  );

  // Compute the overall comments count by adding to the server count the local difference
  const commentsCount = useMemo(
    () => Math.max(0, serverCommentsCount + commentsDifference),
    [commentsDifference, serverCommentsCount],
  );

  return {
    count: commentsCount,
    loading,
    refetch,
  };
};

export default usePostCommentsCount;
