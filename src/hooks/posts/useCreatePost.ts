import { useAppStateValue } from '@recoil/appState';
import { useRemoveStoredPendingPost, useStorePost } from '@recoil/posts';
import { useActiveProfile } from '@recoil/profiles';
import { useCreatePostState, useResetCreatePostState } from '@recoil/screens/createPostState';
import { getConversationId } from 'lib/PostsUtils';
import { err, Ok, ok, Result } from 'neverthrow';
import React from 'react';
import {
  Post,
  PostAttachment,
  PostAttachmentType,
  PostReference,
  PostReferenceType,
  PostStatus,
} from 'types/posts';
import { v4 as uuidv4 } from 'uuid';
import { ImageMedia } from 'services/axios/requests/UploadMedia';
import { scheduleTask } from 'lib/BackgroundTaskUtils';
import CreatePostTask from 'services/tasks/CreatePost';
import usePrepareDesmosClientAndWallet from 'hooks/tx/usePrepareDesmosClientAndWallet';
import useToast from 'hooks/toasts/useToast';
import { useTranslation } from 'react-i18next';
import { ToastType } from 'config/toast/toastConfig';

export interface CreatePostOptions {
  readonly parent?: Post;
  readonly onProcessCompleted?: () => void;
}

/**
 * Converts the given attachment into a {@link PostAttachment} object.
 * @param index - The index of the attachment
 * @param attachment - The attachment to convert
 */
const convertPostImage = (index: number, attachment: ImageMedia): Result<PostAttachment, Error> => {
  const { uri, type } = attachment;
  if (!uri || !type) {
    return err(new Error('Invalid attachment'));
  }

  return ok({
    id: index,
    content: {
      type: PostAttachmentType.MEDIA,
      uri,
      mimeType: type,
    },
    size: undefined,
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
 * Hook that allows to create a post.
 * The details to create the post will be taken from the Recoil atom that is holding the createPostState.
 */
const useCreatePost = () => {
  const { t } = useTranslation('createPost');
  const showToast = useToast();
  const subspaceId = useAppStateValue('subspaceId');
  const activeProfile = useActiveProfile();

  const createPostState = useCreatePostState();
  const resetCreatePostState = useResetCreatePostState();

  const storePost = useStorePost();
  const deletePost = useRemoveStoredPendingPost();

  const prepareDesmosClientAndWallet = usePrepareDesmosClientAndWallet();

  // Callback that creates a post
  return React.useCallback(
    async (options?: CreatePostOptions): Promise<Result<void, Error>> => {
      if (!activeProfile) {
        return err(new Error('Cannot create a post without an active profile'));
      }

      // Get the options
      const { parent, onProcessCompleted } = options ?? {};

      // Get the Desmos client
      const clientAndWalletResult = await prepareDesmosClientAndWallet();
      if (clientAndWalletResult.isErr()) {
        return err(clientAndWalletResult.error);
      }

      const { wallet, desmosClient } = clientAndWalletResult.value;

      // Convert the attachments
      const attachmentsResults = createPostState.attachments.map((media, index) =>
        convertPostImage(index, media),
      );

      // Check if there are errors
      if (attachmentsResults.some(result => result.isErr())) {
        return err(new Error('Invalid attachment'));
      }

      // Get the attachments
      const attachments = attachmentsResults.map(
        result => (result as Ok<PostAttachment, Error>).value,
      );

      // Get the post references
      const postReferences = getPostReferences(createPostState.references, parent);

      // Create the post
      const creationDate = new Date(Date.now()).toISOString();
      const post: Post = {
        ...createPostState,
        id: -1, // TODO: This should be deleted
        status: PostStatus.CREATED_LOCALLY,
        statusUpdateDate: creationDate,
        subspaceId,
        sectionId: createPostState.sectionId ?? parent?.sectionId ?? 0,

        // Generate a random UUID to be used as external ID
        externalId: uuidv4(),

        conversationId: getConversationId(parent),
        references: postReferences,
        attachments,
        creationDate,
        transactions: [],
        author: activeProfile,
        lastUpdatedDate: creationDate,
        hasUserLiked: false,
      };

      // If the post has parent AKA is a comment/reply we should reset the recoil associated with the comment text box value
      // if not the comment text box will not be cleared after clicking the post
      // button waiting for the comment creation to be completed
      if (parent) {
        resetCreatePostState();
      }

      // Store the post locally
      storePost(activeProfile.address, post);

      // Start the task to sign and broadcast the transaction
      const taskReference = await scheduleTask(
        'Broadcast Create Post',
        CreatePostTask,
        {
          desmosClient,
          subspaceId,
          parent,
          post,
          signer: wallet.address,
        },
        {
          title: 'Creating post',
          desc: 'We are creating your post',
          progressBar: {
            indeterminate: true,
          },
        },
      );

      taskReference
        .onStart(() => {
          showToast({
            toastType: ToastType.loading,
            message: t('creating post'),
          });
        })
        .onComplete(() => {
          if (onProcessCompleted) {
            onProcessCompleted();
          }

          showToast({
            toastType: ToastType.success,
            title: t('success', { ns: 'common' }),
            message: t('post created'),
          });
        })
        .onError(({ error }) => {
          if (onProcessCompleted) {
            onProcessCompleted();
          }

          // Delete the cached post
          deletePost(activeProfile.address, post.subspaceId, post.externalId);

          showToast({
            toastType: ToastType.error,
            title: t('error', { ns: 'common' }),
            message: error.message,
          });
        });

      return ok(undefined);
    },
    [
      activeProfile,
      createPostState,
      deletePost,
      prepareDesmosClientAndWallet,
      resetCreatePostState,
      showToast,
      storePost,
      subspaceId,
      t,
    ],
  );
};

export default useCreatePost;
