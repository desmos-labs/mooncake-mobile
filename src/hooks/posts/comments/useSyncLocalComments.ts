import { useActiveAccountAddress } from '@recoil/accounts';
import { useComments } from '@recoil/comments';
import { useSetUserLocalPosts } from '@recoil/localPosts';
import _ from 'lodash';
import { useCallback } from 'react';
import { Post } from 'types/posts';

const useSyncLocalComments = (postId: number) => {
  const activeAccountAddress = useActiveAccountAddress();
  const localComments = useComments(postId);
  const setLocalPosts = useSetUserLocalPosts();

  return useCallback(
    (comments: Post[]) => {
      const toRemoveLocalComments = _.intersectionBy(localComments, comments, p => p.externalId);
      const filteredLocalComments = _.differenceBy(
        localComments,
        toRemoveLocalComments,
        p => p.externalId,
      );
      setLocalPosts(activeAccountAddress, filteredLocalComments);
    },
    [localComments, setLocalPosts, activeAccountAddress],
  );
};

export default useSyncLocalComments;
