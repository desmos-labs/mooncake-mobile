import { useQuery } from '@apollo/client';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useIsPostHiddenLocally } from '@recoil/hiddenPosts';
import { usePostCommentsToSync } from '@recoil/posts';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import { mergePosts } from 'lib/PostsUtils';
import { useCallback, useEffect, useState } from 'react';
import GetPostComments from 'services/graphql/queries/GetPostComments';
import { Post } from 'types/posts';

const usePostComments = (post: Pick<Post, 'subspaceId' | 'id'>, commentsPerPage: number = 50) => {
  const activeAccountAddress = useActiveAccountAddress();
  if (!activeAccountAddress) {
    throw new Error('Active user required for post comments');
  }

  const [comments, setComments] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState();

  const { isPostHiddenLocally, localHiddenPosts } = useIsPostHiddenLocally();
  const commentsToSync = usePostCommentsToSync(activeAccountAddress, post.subspaceId, post.id);

  useEffect(() => {
    const updateComments = () => {
      const filtered = comments.filter(comment => !localHiddenPosts.includes(comment.id));
      const [merged] = mergePosts(filtered, commentsToSync);
      setComments(merged);
    };
    updateComments();
  }, [commentsToSync, localHiddenPosts, isPostHiddenLocally]);

  const onCompleted = useCallback(
    (data: { comments: Post[] }) => {
      if (!data) {
        return;
      }
      const filtered = data.comments.filter(comment => comment.author);
      const onChainComments = filtered.map(convertGraphQLPost);
      const [merged] = mergePosts(comments, onChainComments);
      setComments(merged);
      setFetchingMore(false);
      setRefreshing(false);
      setLoading(false);
    },
    [comments],
  );

  const { refetch, fetchMore } = useQuery(GetPostComments, {
    variables: { postId: post.id, offset: 0, limit: commentsPerPage },
    onCompleted,
    refetchWritePolicy: 'overwrite',
  });

  const fetchMoreComments = useCallback(async () => {
    try {
      setError(undefined);
      setFetchingMore(true);
      await fetchMore({
        variables: { offset: comments.length },
        updateQuery: (prev, { fetchMoreResult }) => ({
          comments: fetchMoreResult ? [...prev.comments, ...fetchMoreResult.comments] : prev,
        }),
      });
    } catch (e: any) {
      setFetchingMore(false);
      setError(e.message);
    }
  }, [fetchMore, comments.length]);

  const refreshComments = useCallback(async () => {
    try {
      setError(undefined);
      setRefreshing(true);
      const { data } = await refetch({ offset: 0 });
      onCompleted(data);
    } catch (e: any) {
      setRefreshing(false);
      setError(e.message);
    }
  }, [onCompleted, refetch]);

  return {
    loading,
    comments,
    refetch: refreshComments,
    refreshing,
    fetchMore: fetchMoreComments,
    fetchingMore,
    error,
  };
};

export default usePostComments;
