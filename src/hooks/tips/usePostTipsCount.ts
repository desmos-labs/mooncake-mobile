import { Post } from 'types/posts';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import GetPostTipsCount from 'services/graphql/queries/GetPostTipsCount';
import { useGetPostTipsDifference } from '@recoil/tips';

/**
 * Hook that allows to get the count of the tips of a post.
 * @param post {Post} - The post for which to get the count of the tips.
 */
const usePostTipsCount = (post: Pick<Post, 'subspaceId' | 'id'>) => {
  const address = useActiveAccountAddress();
  if (!address) {
    throw new Error("Trying to get a post's tips count, without an active address");
  }

  // Get the comments count from the server
  const { data, loading, refetch } = useQuery(GetPostTipsCount, {
    variables: {
      subspaceId: post.subspaceId,
      postId: post.id,
    },
  });
  const serverTipsCount = useMemo(() => data?.tips?.aggregate?.count ?? 0, [data]);

  // Get the comments difference that is stored locally
  const getPostTipsDifference = useGetPostTipsDifference(address);
  const tipsDifference = useMemo(
    () => getPostTipsDifference(post.subspaceId, post.id),
    [getPostTipsDifference, post],
  );

  // Compute the overall tips count by adding to the server count the local difference
  const tipsCount = useMemo(
    () => Math.max(0, serverTipsCount + tipsDifference),
    [tipsDifference, serverTipsCount],
  );

  return {
    count: tipsCount,
    loading,
    refetch,
  };
};

export default usePostTipsCount;
