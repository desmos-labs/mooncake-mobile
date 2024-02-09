import React from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import HidePost from 'services/axios/requests/HidePost';
import { useTranslation } from 'react-i18next';
import { useRemovePostByID } from '@recoil/posts';
import { err, ok, Result } from 'neverthrow';
import useToast from 'hooks/toasts/useToast';
import { ToastType } from 'config/toast/toastConfig';
import { useRemoveCommentByID } from '@recoil/comments';

interface SuccessfulHidePost {
  readonly postID: number;
}

interface HidePostOptions {
  readonly parentID?: number;
}

/**
 * Hook that allows to hide a post.
 */
const useHidePost = () => {
  const showToast = useToast();
  const { t } = useTranslation('postOperations');

  const activeAccountAddress = useActiveAccountAddress();

  const removePostByID = useRemovePostByID();
  const removeCommentByID = useRemoveCommentByID();

  return React.useCallback(
    async (
      postID: number,
      options?: HidePostOptions,
    ): Promise<Result<SuccessfulHidePost, Error>> => {
      if (activeAccountAddress === undefined) {
        return err(new Error('No active account'));
      }

      const hidePostResult = await HidePost(postID);

      if (hidePostResult.isErr()) {
        showToast({
          toastType: ToastType.error,
          title: t('error', { ns: 'common' }),
          message: hidePostResult.error.message,
        });
        return err(new Error('Error occurred while hiding post'));
      }

      if (options?.parentID) {
        // Remove the hidden comment from stored comments
        removeCommentByID(options?.parentID, postID);
      } else {
        // Remove the hidden post from stored posts
        removePostByID(activeAccountAddress, postID);
      }

      showToast({
        toastType: ToastType.success,
        title: t('success', { ns: 'common' }),
        message: t('postHidden'),
      });

      return ok({
        postID,
      });
    },
    [activeAccountAddress, removeCommentByID, removePostByID, showToast, t],
  );
};

export default useHidePost;
