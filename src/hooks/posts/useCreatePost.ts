import React from 'react';
import { Post, PostReference, PostReferenceType } from 'types/posts';
import {
  Media,
  PostReference as DesmJSPostReference,
} from '@desmoslabs/desmjs-types/desmos/posts/v2/models';
import { err, Result } from 'neverthrow';
import useBroadcastTx, { SuccessfulBroadcast } from 'hooks/transactions/useBroadcastTx';
import { useCreatePostState } from '@recoil/screens/createPostState';
import { MsgCreatePostEncodeObject, MsgCreatePostTypeUrl } from '@desmoslabs/desmjs';
import { useAppStateValue } from '@recoil/appState';
import Long from 'long';
import { v4 as uuidv4 } from 'uuid';
import { useActiveAccountAddress } from '@recoil/accounts';
import { mediaToAny } from '@desmoslabs/desmjs/build/aminomessages/posts';
import useUploadAssets from 'hooks/useUploadAssets';
import { Any } from '@desmoslabs/desmjs-types/google/protobuf/any';
import { UploadAssetResult } from 'hooks/useUploadAsset';

/**
 * Gets the conversation id to be used when creating a post.
 * @param parent {Post | undefined} - The parent post, if any
 */
const getConversationId = (parent?: Post): Long => {
  if (!parent) {
    return Long.fromNumber(0);
  }

  if (parent.conversationId === 0) {
    return Long.fromNumber(parent.id);
  }

  return Long.fromNumber(parent.conversationId);
};

/**
 * Converts the post references to the DesmJS format.
 * @param references {PostReference[]} - The references to convert
 */
const convertPostReferences = (references: PostReference[]): DesmJSPostReference[] => {
  return references.map(r => {
    return {
      postId: Long.fromNumber(r.postId),
      position: Long.fromNumber(r.position),
      type: r.type,
    };
  });
};

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

/**
 * Gets the post attachments to be used when creating a post.
 * @param media {UploadAssetResult[]} - The media to use
 */
const getPostAttachments = (media: UploadAssetResult[]): Any[] => {
  return media.map(m => {
    return mediaToAny({
      uri: m.uri,
      mimeType: m.mimeType,
    } as Media);
  });
};

/**
 * Represents the various states of the post creation process.
 */
export enum CreatePostStateType {
  IDLE = 'IDLE',
  UPLOADING_ATTACHMENTS = 'UPLOADING_ATTACHMENTS',
  CREATING_MESSAGE = 'CREATING_MESSAGE',
  BROADCASTING_TRANSACTION = 'BROADCASTING_TRANSACTION',
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
 *
 * TODO: Store the post locally
 * TODO: Store the transaction as pending
 */
const useCreatePost = () => {
  const activeAccountAddress = useActiveAccountAddress();
  if (!activeAccountAddress) {
    throw new Error('Cannot create a post without an active account');
  }

  const subspaceId = useAppStateValue('subspaceId');
  const createPostState = useCreatePostState();

  const uploadAssets = useUploadAssets();
  const broadcastTx = useBroadcastTx();

  const [state, setState] = React.useState<CreatePostState>({ type: CreatePostStateType.IDLE });

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
      const postAttachments = getPostAttachments(uploadResult.value);
      const references = getPostReferences(createPostState.referencedPosts, parent);

      // Build the message
      const msgCreatePost: MsgCreatePostEncodeObject = {
        typeUrl: MsgCreatePostTypeUrl,
        value: {
          subspaceId: Long.fromNumber(subspaceId),

          // Currently Butter does not support sections.
          // We should make sure to set this to the proper value if it ever does
          sectionId: createPostState.sectionId ?? parent?.sectionId ?? 0,

          conversationId: getConversationId(parent),

          // Generate a random UUID
          externalId: uuidv4(),

          // Set the various data here
          text: createPostState.text,
          attachments: postAttachments,

          referencedPosts: convertPostReferences(references),
          entities: createPostState.entities,
          tags: createPostState.tags,
          author: activeAccountAddress,
          replySettings: createPostState.replySettings,
        },
      };

      // Broadcast the message
      setState({ type: CreatePostStateType.BROADCASTING_TRANSACTION });
      const result = await broadcastTx([msgCreatePost]);
      if (result.isErr()) {
        setState({ type: CreatePostStateType.ERROR, error: result.error });
      } else {
        setState({ type: CreatePostStateType.SUCCESS });
      }
      return result;
    },
    [
      activeAccountAddress,
      broadcastTx,
      createPostState.attachments,
      createPostState.entities,
      createPostState.referencedPosts,
      createPostState.replySettings,
      createPostState.sectionId,
      createPostState.tags,
      createPostState.text,
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
