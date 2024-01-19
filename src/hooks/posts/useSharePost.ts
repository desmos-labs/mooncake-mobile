import { ToastType } from 'config/toast/toastConfig';
import useToast from 'hooks/toasts/useToast';
import React from 'react';
import { Share } from 'react-native';
import GetPostShareLink from 'services/axios/requests/GetPostShareLink';

/**
 * Hook that allows to handle the press of the share button of a post.
 */
export const useSharePost = (postId: number) => {
  const showToast = useToast();
  return React.useCallback(async () => {
    const result = await GetPostShareLink(postId);
    if (result.isOk()) {
      await Share.share({
        message: result.value,
        title: 'Share this post with anyone!',
      });
    } else {
      showToast({
        title: 'Oops!',
        message: 'Something went wrong while sharing this post',
        toastType: ToastType.error,
      });
    }
  }, []);
};

export default useSharePost;
