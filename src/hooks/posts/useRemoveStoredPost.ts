import { useActiveAccountAddress } from '@recoil/accounts';
import { useStorePosts } from '@recoil/posts';
import React from 'react';
import { DesmosProfile } from 'types/desmos';

/**
 * Removes a stored post via its postID
 * @param postID {number} - The postID of the post to be removed from local cache.
 */
export const useRemoveStoredPostById = () => {
  const activeAccountAddress = useActiveAccountAddress();

  if (!activeAccountAddress) {
    throw new Error('Trying to remove a stored post without an active address.');
  }
  const storePosts = useStorePosts(activeAccountAddress);

  return React.useCallback(
    (postID: number) => {
      storePosts(storedPosts => storedPosts.filter(post => post.id !== postID));
    },
    [storePosts],
  );
};

/**
 * A hook that allows removal of stored posts by a given author.
 * @param author {DesmosProfile} - The DesmosProfile of the author whose posts will be removed from local cache.
 */
export const useRemoveStoredPostByAuthor = () => {
  const activeAccountAddress = useActiveAccountAddress();

  if (!activeAccountAddress) {
    throw new Error('Trying to remove a stored post without an active address.');
  }
  const storePosts = useStorePosts(activeAccountAddress);

  return React.useCallback(
    (author: DesmosProfile) => {
      storePosts(storedPosts => storedPosts.filter(post => post.author.address !== author.address));
    },
    [storePosts],
  );
};
