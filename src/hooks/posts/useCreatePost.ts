import React from 'react';
import {
  Post,
  PostAttachment,
  PostAttachmentType,
  PostReference,
  PostReferenceType,
  PostStatus,
} from 'types/posts';
import { err, Result } from 'neverthrow';
import useBroadcastTx, { SuccessfulBroadcast } from 'hooks/transactions/useBroadcastTx';
import { useCreatePostState, useResetCreatePostState } from '@recoil/screens/createPostState';
import { useAppStateValue } from '@recoil/appState';
import useUploadAssets from 'hooks/useUploadAssets';
import { useActiveProfile } from '@recoil/profiles';
import { convertPostToMsgCreatePost, getConversationId } from 'lib/PostsUtils';
import { useRemoveStoredPendingPost, useStorePost } from '@recoil/posts';
import { UploadAssetResult } from 'hooks/useUploadAsset';
import { isCanceledOperationError } from 'types/error';
import { v4 as uuidv4 } from 'uuid';

/**
 * Gets the post references to be used when creating a post.
 * @param customReferences {PostReference[]} - The custom references to use
 * @param parent {Post | undefined} - The parent post, if any
 */
const getPostReferences = (
  customReferences: PostReference[],
  parent: Post | undefined,
): PostReference[] => {
  if (!parent) {
    return customReferences;
  }

  const replyReference: PostReference = {
    postId: parent.id,
    position: 0,
    type: PostReferenceType.POST_REFERENCE_TYPE_REPLY,
  };

  return [...customReferences, replyReference];
};

const convertAttachment = (result: UploadAssetResult, index: number): PostAttachment => {
  return {
    id: index,
    content: {
      type: PostAttachmentType.MEDIA,
      uri: result.uri,
      mimeType: result.mimeType,
    },
    size: undefined,
  };
};

/**
 * Represents the various states of the post creation process.
 */
export enum CreatePostStateType {
  IDLE = 'IDLE',
  UPLOADING_ATTACHMENTS = 'UPLOADING_ATTACHMENTS',
  CREATING_MESSAGE = 'CREATING_MESSAGE',
  BROADCASTING_TRANSACTION = 'BROADCASTING_TRANSACTION',
  CANCELED = 'CANCELED',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

/**
 * Represents a simple state of the post creation process that does not contain additional data.
 */
export interface CreatePostSimpleState {
  type:
    | CreatePostStateType.IDLE
    | CreatePostStateType.UPLOADING_ATTACHMENTS
    | CreatePostStateType.CREATING_MESSAGE
    | CreatePostStateType.BROADCASTING_TRANSACTION
    | CreatePostStateType.CANCELED
    | CreatePostStateType.SUCCESS;
}

/**
 * Represents an error state of the post creation process.
 */
export interface CreatePostErrorState {
  type: CreatePostStateType.ERROR;
  error: Error;
}

/**
 * Represents the state of the post creation process.
 */
export type CreatePostState = CreatePostSimpleState | CreatePostErrorState;

/**
 * Hook that allows to create a post.
 * The details to create the post will be taken from the Recoil atom that is holding the createPostState.
 */
const useCreatePost = () => {
  const activeProfile = useActiveProfile();
  if (!activeProfile) {
    throw new Error('Cannot create a post without an active profile');
  }

  const subspaceId = useAppStateValue('subspaceId');
  const createPostState = useCreatePostState();
  const resetCreatePostState = useResetCreatePostState();

  const storePost = useStorePost(activeProfile.address);
  const deletePost = useRemoveStoredPendingPost(activeProfile.address);

  const uploadAssets = useUploadAssets();
  const broadcastTx = useBroadcastTx();

  const [state, setState] = React.useState<CreatePostState>({ type: CreatePostStateType.IDLE });

  // Callback that creates a post
  const createPost = React.useCallback(
    async (parent?: Post): Promise<Result<SuccessfulBroadcast, Error>> => {
      // Upload the attachments
      setState({ type: CreatePostStateType.UPLOADING_ATTACHMENTS });
      const uploadResult = await uploadAssets(createPostState.attachments);
      if (uploadResult.isErr()) {
        setState({ type: CreatePostStateType.ERROR, error: uploadResult.error });
        return err(uploadResult.error);
      }

      // Convert the various data to the proper format
      setState({ type: CreatePostStateType.CREATING_MESSAGE });
      const postAttachments = uploadResult.value.map(convertAttachment);
      const postReferences = getPostReferences(createPostState.references, parent);

      // Create the post
      const creationDate = new Date(Date.now()).toISOString();
      const post: Post = {
        ...createPostState,
        status: PostStatus.CREATED_LOCALLY,
        statusUpdateDate: creationDate,
        subspaceId,
        sectionId: createPostState.sectionId ?? parent?.sectionId ?? 0,
        id: -1, // TODO: This should be deleted

        // Generate a random UUID to be used as external ID
        externalId: uuidv4(),

        conversationId: getConversationId(parent),
        references: postReferences,
        attachments: postAttachments,
        creationDate,
        transactions: [],
        author: activeProfile,
      };

      // Store the post locally
      storePost(post);

      // Build the message
      const msgCreatePost = convertPostToMsgCreatePost(post);

      // Broadcast the message
      setState({ type: CreatePostStateType.BROADCASTING_TRANSACTION });
      const result = await broadcastTx([msgCreatePost]);
      if (result.isErr()) {
        // If there is an error, delete the post from the local storage
        deletePost(post.subspaceId, post.externalId);
        if (isCanceledOperationError(result.error)) {
          setState({ type: CreatePostStateType.CANCELED });
        }
        setState({ type: CreatePostStateType.ERROR, error: result.error });
      } else {
        // If the post creation was successful, reset the state
        resetCreatePostState();
        setState({ type: CreatePostStateType.SUCCESS });
      }
      return result;
    },
    [
      activeProfile,
      broadcastTx,
      createPostState,
      deletePost,
      resetCreatePostState,
      storePost,
      subspaceId,
      uploadAssets,
    ],
  );

  return {
    state,
    createPost,
  };
};

export default useCreatePost;
