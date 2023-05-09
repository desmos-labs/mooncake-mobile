import React from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import HidePost from 'services/axios/requests/HidePost';
import useCustomToast from 'hooks/extended/useCustomToast';
import { useTranslation } from 'react-i18next';

const useHidePost = () => {
  const activeAccountAddress = useActiveAccountAddress();
  const toast = useCustomToast();
  const { t } = useTranslation('toast');

  return React.useCallback(
    async (postID: number) => {
      if (!activeAccountAddress) {
        throw new Error('Trying to hide a post, without an active account');
      }

      const hidePostResult = await HidePost(postID);

      if (hidePostResult.isErr()) {
        toast.errorNoRetry(t('errorHidePost'));
      }
      if (hidePostResult.isOk()) {
        toast.success(t('postHidden'));
      }
    },
    [activeAccountAddress, t, toast],
  );
};

export default useHidePost;
