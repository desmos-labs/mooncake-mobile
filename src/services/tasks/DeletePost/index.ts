import { getTaskContext } from 'lib/BackgroundTaskUtils';
import { TaskJob } from 'lib/BackgroundTaskUtils/types';
import { convertPostToMsgDeletePost } from 'lib/PostsUtils';
import { SignAndBroadcastTxParams } from 'services/tasks/SignAndBroadcastTx';
import { Post } from 'types/posts';

interface DeletePostTaskParams extends Omit<SignAndBroadcastTxParams, 'messages'> {
  readonly subspaceId: number;
  readonly post: Post;
}

/**
 * Task that can be executed in the background in order to delete a post.
 * @param params - Parameters required to delete the post.
 * @constructor
 */
const DeletePostTask: TaskJob<DeletePostTaskParams, { transactionHash: string }> = async (
  params: DeletePostTaskParams,
) => {
  const { desmosClient, signer, memo, feeGranter, post } = params;
  const { apiBearerToken, broadcastTx } = getTaskContext();

  if (apiBearerToken === undefined) {
    throw new Error('You are not authenticated');
  }

  // Build the message
  const msgDeletePost = convertPostToMsgDeletePost(post);
  const broadcastTxResult = await broadcastTx(desmosClient, signer, [msgDeletePost], {
    memo,
    feeGranter,
  });

  return {
    transactionHash: broadcastTxResult.transactionHash,
  };
};

export default DeletePostTask;
