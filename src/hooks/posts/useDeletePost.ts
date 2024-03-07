import { useAppStateValue } from '@recoil/appState';
import { useRemoveCommentByID } from '@recoil/comments';
import { useSetPostCommentsCount } from '@recoil/commentsCount';
import { useDeleteStoredPost, useStorePost } from '@recoil/posts';
import { useActiveProfile } from '@recoil/profiles';
import { ToastType } from 'config/toast/toastConfig';
import useToast from 'hooks/toasts/useToast';
import usePrepareDesmosClientAndWallet from 'hooks/tx/usePrepareDesmosClientAndWallet';
import { scheduleTask } from 'lib/BackgroundTaskUtils';
import { err, ok, Result } from 'neverthrow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import DeletePostTask from 'services/tasks/DeletePost';
import { Post, PostStatus } from 'types/posts';

export interface DeletePostOptions {
  readonly post: Post;
  readonly parent?: Post;
  readonly onProcessCompleted?: () => void;
}

/**
 * Hook that allows to delete a post.
 * The post will be deleted from the user's timeline.
 */
const useDeletePost = () => {
  const { t } = useTranslation('createPost');
  const showToast = useToast();
  const subspaceId = useAppStateValue('subspaceId');
  const activeProfile = useActiveProfile();
  const storePost = useStorePost();
  const deleteStoredPost = useDeleteStoredPost();
  const deleteStoredComment = useRemoveCommentByID();
  const setPostCommentsCount = useSetPostCommentsCount();
  const prepareDesmosClientAndWallet = usePrepareDesmosClientAndWallet();

  // Callback that creates a post
  return React.useCallback(
    async (options: DeletePostOptions): Promise<Result<void, Error>> => {
      if (!activeProfile) {
        return err(new Error('Cannot create a post without an active profile'));
      }

      // Get the options
      const { post, parent, onProcessCompleted } = options;

      // Get the Desmos client
      const clientAndWalletResult = await prepareDesmosClientAndWallet();
      if (clientAndWalletResult.isErr()) {
        return err(clientAndWalletResult.error);
      }

      const { wallet, desmosClient } = clientAndWalletResult.value;

      // Start the task to sign and broadcast the transaction
      const taskReference = await scheduleTask(
        'Broadcast Delete Post',
        DeletePostTask,
        {
          desmosClient,
          subspaceId,
          post,
          signer: wallet,
        },
        // TODO: Use localized messages here
        {
          title: 'Deleting Post',
          desc: t('deleting post'),
          progressBar: {
            indeterminate: true,
          },
        },
      );

      taskReference
        .onStart(() => {
          // Update the post status to broadcasting
          // This way the UI will show the loading spinner and the user will not be able to interact with the post
          const postToDelete = {
            ...post,
            status: PostStatus.BROADCASTING,
          };
          storePost(activeProfile.address, postToDelete);
          showToast({
            toastType: ToastType.loading,
            message: t('deleting post'),
          });
        })
        .onComplete(() => {
          if (onProcessCompleted) {
            onProcessCompleted();
          }

          deleteStoredPost(activeProfile.address, post);

          if (parent) {
            setPostCommentsCount(parent.id, count => count + -1);
            deleteStoredComment(parent.id, post.id);
          }

          showToast({
            toastType: ToastType.success,
            title: t('success', { ns: 'common' }),
            message: t('post deleted'),
          });
        })
        .onError(({ error }) => {
          if (onProcessCompleted) {
            onProcessCompleted();
          }
          console.log('error', error);

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
      deleteStoredComment,
      deleteStoredPost,
      prepareDesmosClientAndWallet,
      setPostCommentsCount,
      showToast,
      storePost,
      subspaceId,
      t,
    ],
  );
};

export default useDeletePost;
