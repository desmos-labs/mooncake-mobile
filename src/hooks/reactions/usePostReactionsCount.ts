import { useQuery } from '@apollo/client';
import GetPostReactionsCount from 'services/graphql/queries/GetPostReactionsCount';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useMemo } from 'react';
import { Post } from 'types/posts';
import { useGetPostReactionsDifference } from '@recoil/reactions';

/**
 * Hook that allows to get the count of reactions of a given post.
 * @param post {Post} - Post for which to get the reactions count.
 */
const usePostReactionsCount = (post: Pick<Post, 'subspaceId' | 'id'>) => {
  const address = useActiveAccountAddress();

  if (!address) {
    throw new Error("Trying to get a post's reactions count, without an active address");
  }

  // Get the reactions count from the server
  const { data, loading, refetch } = useQuery(GetPostReactionsCount, {
    variables: {
      subspaceId: post.subspaceId,
      postId: post.id,
    },
  });

  const serverReactionsCount = useMemo(() => data?.reactions?.aggregate?.count ?? 0, [data]);

  // Get the reactions difference that is stored locally
  const getReactionsDifference = useGetPostReactionsDifference(address);
  const reactionsDifference = useMemo(
    () => getReactionsDifference(post.subspaceId, post.id),
    [getReactionsDifference, post],
  );

  // Compute the overall reactions count by adding to the server count the local difference
  const reactionsCount = useMemo(
    () => Math.max(0, serverReactionsCount + reactionsDifference),
    [reactionsDifference, serverReactionsCount],
  );

  return {
    count: reactionsCount,
    loading,
    refetch,
  };
};

export default usePostReactionsCount;
