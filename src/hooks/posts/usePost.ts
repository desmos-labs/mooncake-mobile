import { useActiveAccountAddress } from '@recoil/accounts';
import { useSetPostCommentsCount } from '@recoil/commentsCount';
import { useCachedPostById, useStorePost } from '@recoil/posts';
import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import { useCallback, useEffect, useState } from 'react';
import GetPostByID from 'services/graphql/queries/GetPostByID';
import { Post } from 'types/posts';

/**
 * Hook that allows to get the details of a post, or refetch them if needed.
 */
const usePost = (postId: number, storedPost?: Post) => {
  const [loading, setLoading] = useState(false);
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to get the details of a post without an active address');
  }

  const post = useCachedPostById(activeAddress, postId);
  const storePost = useStorePost();
  const setPostCommentsCount = useSetPostCommentsCount();

  // Callback to update the cached post after has been fetched.
  const onDataFetched = useCallback(
    async (data: any) => {
      const fetchedPost = data?.posts?.at(0);
      if (fetchedPost) {
        const convertedPost = convertGraphQLPost(fetchedPost);
        storePost(activeAddress, convertedPost);
        setPostCommentsCount(convertedPost.id, convertedPost.commentsCount);
      }
    },
    [activeAddress, setPostCommentsCount, storePost],
  );

  // Query the post from the GraphQL server
  const [getLazyQuery] = useCustomLazyQuery(GetPostByID, {
    refetchWritePolicy: 'overwrite',
    variables: {
      postId,
    },
  });

  const cachedRefetch = useCallback(async () => {
    setLoading(true);
    const apolloResult = await getLazyQuery();
    if (apolloResult.error === undefined) {
      onDataFetched(apolloResult.data);
    }
    setLoading(false);
    return apolloResult;
  }, [getLazyQuery, onDataFetched]);

  useEffect(() => {
    if (storedPost === undefined) {
      cachedRefetch();
    } else {
      storePost(activeAddress, storedPost);
    }
  }, [storedPost, activeAddress, cachedRefetch, storePost]);

  return {
    loading,
    post,
    refetch: cachedRefetch,
  };
};

export default usePost;
