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
  const showToast = useToast();
  const { t } = useTranslation('postOperations');
  const removePostByID = useRemovePostByID();
  const addPostToHidden = useAddPostToHiddenPosts();

  return React.useCallback(
    async (postID: number): Promise<Result<SuccessfulHidePost, Error>> => {
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

      // Remove the hidden post from stored posts
      removePostByID(activeAccountAddress, postID);

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
    [activeAccountAddress, addPostToHidden, removePostByID, showToast, t],
  );
};

export default useHidePost;
