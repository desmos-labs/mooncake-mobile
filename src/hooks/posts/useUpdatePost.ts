import { Post, PostData } from 'types/posts';
import React from 'react';
import useGetPostData from 'hooks/posts/useGetPostData';

/**
 * Hook that gets the proper {@link PostData} value for the given {@param post}, and then calls the given
 * {@param callback} function each time that the {@param post} changes.
 * @param activeAddress {string} - Address of the current app user.
 */
const useUpdatePosts = (
  activeAddress: string,
  post: Post | undefined,
  callback: (posts: PostData) => void,
) => {
  // Update the posts
  const getPostData = useGetPostData(activeAddress);
  const updatePost = React.useCallback(async () => {
    if (!post) return;
    const postData = await getPostData(post);
    callback(postData);
  }, [getPostData, post, callback]);

  // Make sure to update the posts when the posts change
  React.useEffect(() => {
    updatePost();
  }, [updatePost]);
};

export default useUpdatePosts;
