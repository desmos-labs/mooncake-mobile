import { useActiveAccountAddress } from '@recoil/accounts';
import {
  usePostCommentsCount as useRecoilPostCommentsCount,
  useSetPostCommentsCount,
} from '@recoil/commentsCount';
import { useGetAllUnsyncedPosts } from '@recoil/localPosts';
import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';
import { useCallback, useEffect, useState } from 'react';
import GetPostCommentsCount from 'services/graphql/queries/GetPostCommentsCount';
import { isCommentTo, Post } from 'types/posts';

/**
 * Hook that allows to get the count of the comments of a post.
 * @param post {Post} - The post for which to get the count of the comments.
 * */
const usePostCommentsCount = (post: Pick<Post, 'subspaceId' | 'id'>) => {
  const [loading, setLoading] = useState(false);

  const address = useActiveAccountAddress();
  const getUnsyncedComments = useGetAllUnsyncedPosts(address);
  const setCommentsCount = useSetPostCommentsCount();
  const count = useRecoilPostCommentsCount(post.id);
  // Get the comments count from the server
  const [getLazyData] = useCustomLazyQuery(GetPostCommentsCount, {
    fetchPolicy: 'no-cache',
  });

  const getCommentsCount = useCallback(async () => {
    setLoading(true);
    const unsyncedPostComments = await getUnsyncedComments().then(result => {
      return result.filter(p => isCommentTo(p, post.id));
    });
    const data = await getLazyData({
      variables: {
        postId: post.id,
        unsyncedCreatedPosts: unsyncedPostComments.map(p => p.id),
      },
    });

    const serverCommentsCount = data?.comments?.aggregate?.count ?? 0;
    const createdCommentsCount = data?.createdComments?.aggregate?.count ?? 0;
    const commentsCount = serverCommentsCount + unsyncedPostComments.length - createdCommentsCount;
    setCommentsCount(post.id, commentsCount);
    setLoading(false);
  }, [getLazyData, getUnsyncedComments, post.id, setCommentsCount]);

  useEffect(() => {
    getCommentsCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    count,
    loading,
    refetch: getCommentsCount,
  };
};

export default usePostCommentsCount;
