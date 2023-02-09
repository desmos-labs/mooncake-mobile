import React, { useState } from 'react';
import { Post } from 'types/posts';
import { ok, Result } from 'neverthrow';

/**
 * Hook that allows to create a post.
 * The details to create the post will be taken from the Recoil atom that is holding the createPostState.
 * TODO: Implement this
 */
const useCreatePost = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const createPost = React.useCallback(async (parent?: Post): Promise<Result<void, Error>> => {
    console.log('Implement useCreatePost');
    return ok(undefined);
  }, []);
  return {
    loading,
    createPost,
  };
};

export default useCreatePost;
