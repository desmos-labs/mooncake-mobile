import { useSetUserLocalPosts } from '@recoil/localPosts';
import _ from 'lodash';
import { useCallback } from 'react';
import { Post } from 'types/posts';

/**
 * Hook that allows to sync the locally stored posts by removing those
 * that have the same external ids as the ones present in the given list.
 *
 * <b>Note</b>
 * This should be used in all the places where a list of posts is fetched from
 * the server, to make sure the local posts can be updated properly.
 * @param userAddress
 */
const useSyncLocalPosts = (userAddress: string | undefined) => {
  const setUserLocalPosts = useSetUserLocalPosts();

  return useCallback(
    (posts: Post[]) => {
      setUserLocalPosts(userAddress, localPosts => {
        const toRemoveLocalPosts = _.intersectionBy(localPosts, posts, p => p.externalId);
        return _.differenceBy(localPosts, toRemoveLocalPosts, p => p.externalId);
      });
    },
    [setUserLocalPosts, userAddress],
  );
};

export default useSyncLocalPosts;
