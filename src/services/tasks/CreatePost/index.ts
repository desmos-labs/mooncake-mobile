import { getTaskContext } from 'lib/BackgroundTaskUtils';
import { TaskJob } from 'lib/BackgroundTaskUtils/types';
import { convertPostToMsgCreatePost } from 'lib/PostsUtils';
import { uploadPicture } from 'lib/UploadUtils';
import { err, Ok, ok, Result } from 'neverthrow';
import { SignAndBroadcastTxParams } from 'services/tasks/SignAndBroadcastTx';
import { Post, PostAttachment, PostAttachmentType } from 'types/posts';

interface CreatePostTaskParams extends Omit<SignAndBroadcastTxParams, 'messages'> {
  readonly subspaceId: number;
  readonly parent?: Post;
  readonly post: Post;
}

/**
 * Uploads the given attachment to the server.
 * @param index - The index of the attachment
 * @param attachment - The attachment to upload
 * @param bearerToken - The bearer token to use to authenticate the request
 */
const uploadAttachment = async (
  index: number,
  attachment: PostAttachment,
  bearerToken: string,
): Promise<Result<PostAttachment, Error>> => {
  if (attachment.content.type !== PostAttachmentType.MEDIA) {
    return ok(attachment);
  }

  const result = await uploadPicture(attachment.content.uri, bearerToken);
  if (result.isErr()) {
    return err(result.error);
  }

  const { url } = result.value;
  return ok({
    id: index,
    content: {
      type: PostAttachmentType.MEDIA,
      uri: url,
      mimeType: attachment.content.mimeType,
    },
    size: undefined,
  });
};

/**
 * Task that can be executed in the background in order to create a post.
 * @param params - Parameters required to create the post.
 * @constructor
 */
const CreatePostTask: TaskJob<CreatePostTaskParams, string> = async (
  params: CreatePostTaskParams,
) => {
  const { desmosClient, signer, memo, post } = params;
  const { apiBearerToken, broadcastTx } = getTaskContext();

  if (apiBearerToken === undefined) {
    throw new Error('You are not authenticated');
  }

  // Upload the attachments
  const attachments = await Promise.all(
    post.attachments.map((attachment, index) =>
      uploadAttachment(index, attachment, apiBearerToken),
    ),
  );

  // Make sure no errors occurred while uploading the attachments
  if (attachments.some(attachment => attachment.isErr())) {
    throw new Error('Error while uploading the attachments');
  }

  // Get the attachments
  const postAttachments = attachments.map(
    attachment => (attachment as Ok<PostAttachment, Error>).value,
  );
  // Update the post fields to the one that we have changed
  const postToConvert = {
    ...post,
    attachments: postAttachments,
  };

  // Build the message
  const msgCreatePost = convertPostToMsgCreatePost(postToConvert);
  const broadcastTxResult = await broadcastTx(desmosClient, signer, [msgCreatePost], memo);
  return broadcastTxResult.transactionHash;
};

export default CreatePostTask;
