import React from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import HidePost from 'services/axios/requests/HidePost';
import useCustomToast from 'hooks/extended/useCustomToast';
import { useTranslation } from 'react-i18next';
import { useStorePosts } from '@recoil/posts';
import { err, ok, Result } from 'neverthrow';
import { useAddPostToHiddenPosts } from '@recoil/hiddenPosts';

export interface SuccessfulHidePost {
  readonly postID: number;
}

const useHidePost = () => {
  const activeAccountAddress = useActiveAccountAddress();

  if (!activeAccountAddress) {
    throw new Error('Trying to hide a post, without an active account');
  }

  const toast = useCustomToast();
  const { t } = useTranslation('toast');
  const storePosts = useStorePosts(activeAccountAddress);
  const addPostToHidden = useAddPostToHiddenPosts();

  return React.useCallback(
    async (postID: number): Promise<Result<SuccessfulHidePost, Error>> => {
      const hidePostResult = await HidePost(postID);

      if (hidePostResult.isErr()) {
        toast.errorNoRetry(t('errorHidePost'));
        return err(new Error('Error occurred while hiding post'));
      }

      // Remove the hidden post from stored posts
      storePosts(storedPosts => storedPosts.filter(post => post.id !== postID));

      // Add postID to local hidden posts
      addPostToHidden(postID);

      toast.success(t('postHidden'));
      return ok({
        postID,
      });
    },
    [storePosts, t, toast],
  );
};

export default useHidePost;
