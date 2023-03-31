import React from 'react';
import { useQuery } from '@apollo/client';
import GetPostByID from 'services/graphql/queries/GetPostByID';
import { useActiveAccountAddress } from '@recoil/accounts';
import { usePostByID, useRemovePost, useStorePost } from '@recoil/posts';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import { mergePosts } from 'lib/PostsUtils';
import useUpdatePostReactionCache from 'hooks/reactions/useUpdatePostReactionsCache';
import useGetQueryReactionValue from 'hooks/graphql/useGetQueryReactionValue';
import { PostData } from 'types/posts';
import useUpdatePost from 'hooks/posts/useUpdatePost';

/**
 * Hook that allows to get the details of a post, or refetch them if needed.
 */
const usePost = (subspaceId: number, postId: number) => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to get the details of a post without an active address');
  }

  const storePost = useStorePost(activeAddress);
  const deletePost = useRemovePost(activeAddress);

  const updatePostReactionCache = useUpdatePostReactionCache(activeAddress);

  // Use the cached post value as the single source of truth
  const post = usePostByID(activeAddress, subspaceId, postId);

  // Query the post from the GraphQL server
  const getQueryReactionValue = useGetQueryReactionValue();
  const { data, refetch, loading } = useQuery(GetPostByID, {
    refetchWritePolicy: 'overwrite',
    variables: {
      subspaceId,
      postId,
      user: activeAddress,
      reaction: getQueryReactionValue(),
    },
  });

  React.useEffect(() => {
    if (!data) return;

    const { posts } = data;
    const onChainPost = posts.length > 0 ? convertGraphQLPost(posts[0]) : undefined;
    if (onChainPost) {
      updatePostReactionCache(onChainPost);
    }

    // Build the variables to merge the posts accordingly
    const existingPosts = post === undefined ? [] : [post];
    const externalPosts = onChainPost === undefined ? [] : [onChainPost];

    // Merge the posts data
    const [result] = mergePosts(existingPosts, externalPosts);

    // Get the post to store
    const postToStore = result.length > 0 ? result[0] : undefined;
    if (postToStore === undefined && post !== undefined) {
      // The post to store returned is undefined, but the post existed on the cache.
      // This means we need to delete the cached version
      deletePost(post.subspaceId, post.externalId);
    } else if (postToStore !== undefined) {
      storePost(postToStore);
    }
  }, [data, deletePost, post, storePost, updatePostReactionCache]);

  const [postData, setPostData] = React.useState<PostData | undefined>();
  useUpdatePost(activeAddress, post, setPostData);

  return {
    loading,
    post: postData,
    refetch,
  };
};

export default usePost;
