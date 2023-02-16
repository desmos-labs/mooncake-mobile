import React from 'react';
import { Post } from 'types/posts';
import { ok, Result } from 'neverthrow';
import { SuccessfulBroadcast } from 'hooks/useBroadcastTx';

/**
 * Hook that allows to create a post.
 * The details to create the post will be taken from the Recoil atom that is holding the createPostState.
 * TODO: Implement this
 */
const useCreatePost = () => {
  return React.useCallback(async (parent?: Post): Promise<Result<SuccessfulBroadcast, Error>> => {
    console.log('Implement useCreatePost');
    return ok({ txHash: '' });
  }, []);
};

export default useCreatePost;
