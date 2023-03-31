import { Post } from 'types/posts';
import React from 'react';
import useGetPostData from 'hooks/posts/useGetPostData';

/**
 * Hook that returns a function allowing to get the posts data from the server.
 * @param userAddress {string} - Address of the current app user.
 */
const useGetPostsData = (userAddress: string) => {
  const getPostData = useGetPostData(userAddress);
  return React.useCallback(
    async (posts: Post[]) => {
      return Promise.all(posts.map(post => getPostData(post)));
    },
    [getPostData],
  );
};

export default useGetPostsData;
