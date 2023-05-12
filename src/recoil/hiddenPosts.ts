import React from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

/**
 * An atom that keeps track of the posts hidden by the user for the given session.
 * This is useful for the comments section, as comments are stored in a useState, so
 * values in this recoil can be used to filter out hidden comments.
 */
const hiddenPostsState = atom<number[]>({
  key: 'hiddenPostsState',
  default: [],
});

/**
 * A hook that checks if a given postID is in the list of local hidden posts.
 */
export const useIsPostHiddenLocally = () => {
  const localHiddenPosts = useRecoilValue(hiddenPostsState);

  const isPostHiddenLocally = React.useCallback(
    (postID: number) => {
      return localHiddenPosts.includes(postID);
    },
    [localHiddenPosts],
  );

  return {
    isPostHiddenLocally,
    localHiddenPosts,
  };
};

/**
 * A hook that allows adding additional postIDs to the list of locally hidden posts.
 */
export const useAddPostToHiddenPosts = () => {
  const setHiddenPostsState = useSetRecoilState(hiddenPostsState);

  return React.useCallback(
    (postID: number) => {
      setHiddenPostsState(prev => {
        console.log(prev);
        return [...prev, postID];
      });
    },
    [setHiddenPostsState],
  );
};
