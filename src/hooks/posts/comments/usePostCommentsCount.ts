import { Post } from 'types/posts';
import { useActiveAccountAddress } from '@recoil/accounts';
import React, { useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import GetPostCommentsCount from 'services/graphql/queries/GetPostCommentsCount';
import { useGetPostCommentsDifference } from '@recoil/localPosts';

/**
 * Hook that allows to get the count of the comments of a post.
 * @param post {Post} - The post for which to get the count of the comments.
 * */
const usePostCommentsCount = (post: Pick<Post, 'subspaceId' | 'id'>) => {
  const firstEffect = React.useRef(true);
  const address = useActiveAccountAddress();
  const getCommentsDifference = useGetPostCommentsDifference();

  // Get the comments count from the server
  const { data, loading, refetch } = useQuery(GetPostCommentsCount, {
    fetchPolicy: 'no-cache',
    variables: {
      postId: post.id,
    },
  });
  const serverCommentsCount = useMemo(() => data?.comments?.aggregate?.count ?? 0, [data]);

  // Get the comments difference that is stored locally
  const commentsDifference = useMemo(
    () => (address ? getCommentsDifference(address, post.subspaceId, post.id) : 0),
    [address, getCommentsDifference, post.id, post.subspaceId],
  );

  // Compute the overall comments count by adding to the server count the local difference
  const commentsCount = useMemo(
    () => Math.max(0, serverCommentsCount + commentsDifference),
    [commentsDifference, serverCommentsCount],
  );

  useEffect(() => {
    if (!firstEffect.current) {
      console.log('Triggering refetch of usePostCommentsCount');
      refetch();
    } else {
      firstEffect.current = false;
    }
  }, [commentsDifference, refetch]);

  return {
    count: commentsCount,
    loading,
    refetch,
  };
};

export default usePostCommentsCount;
