import React from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import HidePost from 'services/axios/requests/HidePost';
import { useTranslation } from 'react-i18next';
import { useRemovePostByID } from '@recoil/posts';
import { err, ok, Result } from 'neverthrow';
import { useAddPostToHiddenPosts } from '@recoil/hiddenPosts';
import useToast from 'hooks/toasts/useToast';
import { ToastType } from 'config/toast/toastConfig';

interface SuccessfulHidePost {
  readonly postID: number;
}

const useHidePost = () => {
  const activeAccountAddress = useActiveAccountAddress();

  if (!activeAccountAddress) {
    throw new Error('Trying to hide a post, without an active account');
  }

  const showToast = useToast();
  const { t } = useTranslation('postOperations');
  const removePostByID = useRemovePostByID(activeAccountAddress);
  const addPostToHidden = useAddPostToHiddenPosts();

  return React.useCallback(
    async (postID: number): Promise<Result<SuccessfulHidePost, Error>> => {
      const hidePostResult = await HidePost(postID);

      if (hidePostResult.isErr()) {
        showToast({
          toastType: ToastType.error,
          title: t('error', { ns: 'common' }),
          message: hidePostResult.error.message,
        });
        return err(new Error('Error occurred while hiding post'));
      }

      // Remove the hidden post from stored posts
      removePostByID(postID);

      // Add postID to local hidden posts
      addPostToHidden(postID);

      showToast({
        toastType: ToastType.success,
        title: t('success', { ns: 'common' }),
        message: t('postHidden'),
      });

      return ok({
        postID,
      });
    },
    [addPostToHidden, removePostByID, showToast, t],
  );
};

export default useHidePost;
