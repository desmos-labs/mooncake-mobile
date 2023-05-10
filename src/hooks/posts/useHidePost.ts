import React from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import HidePost from 'services/axios/requests/HidePost';
import useCustomToast from 'hooks/extended/useCustomToast';
import { useTranslation } from 'react-i18next';
import { useStorePosts } from '@recoil/posts';

const useHidePost = () => {
  const activeAccountAddress = useActiveAccountAddress();

  if (!activeAccountAddress) {
    throw new Error('Trying to hide a post, without an active account');
  }

  const toast = useCustomToast();
  const { t } = useTranslation('toast');
  const storePosts = useStorePosts(activeAccountAddress);

  return React.useCallback(
    async (postID: number) => {
      const hidePostResult = await HidePost(postID);

      if (hidePostResult.isErr()) {
        toast.errorNoRetry(t('errorHidePost'));
      }
      if (hidePostResult.isOk()) {
        // Remove the hidden post from stored posts
        storePosts(storedPosts => storedPosts.filter(post => post.id !== postID));
        toast.success(t('postHidden'));
      }
    },
    [storePosts, t, toast],
  );
};

export default useHidePost;
