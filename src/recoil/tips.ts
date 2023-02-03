import React from 'react';
import { Post } from 'types/posts';

/**
 * Hook that allows to check whether a given user has tipped a post or not.
 * TODO: Implement this
 */
export const useHasPostTip = () => {
  return React.useCallback((user: string, post: Post) => {
    return false;
  }, []);
};
