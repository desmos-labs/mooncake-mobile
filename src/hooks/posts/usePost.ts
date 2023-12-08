import React from 'react';
import { useQuery } from '@apollo/client';
import GetPostByID from 'services/graphql/queries/GetPostByID';
import { useActiveAccountAddress } from '@recoil/accounts';
import { usePostByID, useRemovePost, useStorePost } from '@recoil/posts';
import { convertGraphQLPost } from 'lib/GraphQLUtils';

/**
 * Hook that allows to get the details of a post, or refetch them if needed.
 */
const usePost = (postId: number) => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to get the details of a post without an active address');
  }

  const storePost = useStorePost();
  const deletePost = useRemovePost();

  // Use the cached post value as the single source of truth
  const post = usePostByID(activeAddress, postId);

  // Query the post from the GraphQL server
  const { data, refetch, loading } = useQuery(GetPostByID, {
    refetchWritePolicy: 'overwrite',
    variables: {
      postId,
    },
  });

  React.useEffect(() => {
    if (!data) return;

    if (!activeAddress) {
      throw new Error('Cannot create a post without an active profile');
    }

    const { posts } = data;
    const onChainPost = posts.length > 0 ? convertGraphQLPost(posts[0]) : undefined;

    if (!onChainPost && post) {
      // The post to store returned is undefined, but the post existed on the cache.
      // This means we need to delete the cached version
      deletePost(activeAddress, post.externalId);
    } else if (onChainPost) {
      storePost(activeAddress, onChainPost);
    }
  }, [activeAddress, data, deletePost, post, storePost]);

  return {
    loading,
    post,
    refetch,
  };
};

export default usePost;
