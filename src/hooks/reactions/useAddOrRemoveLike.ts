import { Post } from 'types/posts';
import React, { useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import LikePost from 'services/axios/requests/LikePost';

/**
 * Hook that allows to properly implement the addition and removal of a post like.
 */
const useAddOrRemoveLike = (post: Post) => {
  // TODO: Properly resolve the like status once we have the new Post definition.
  const postLiked = post.id.toString().length % 2 === 0;

  // Local state used to avoid the need to wait for the server response
  // and have a more responsive UI as soon as the user presses the like button
  const [liked, setLiked] = React.useState(postLiked);

  // Update the local state when the server response changes
  React.useEffect(() => {
    setLiked(postLiked);
  }, [postLiked]);

  // Debounce the add or remove reaction function to avoid spamming the server
  const likeUnlikePost = React.useCallback(async (p: Post) => {
    // TODO: Properly resolve the like status once we have the new Post definition.
    const isPostLiked = false;
    let error: Error | undefined;

    if (isPostLiked) {
      // Post already liked, unlike it.
      const likeResult = await UnlikePost(p.id);
      if (likeResult.isErr()) {
        error = likeResult.error;
      }
    } else {
      // Post not liked, like it.
      const unlikeResult = await LikePost(p.id);
      if (unlikeResult.isErr()) {
        error = unlikeResult.error;
      }
    }

    if (error) {
      // Restore the like status on error.
      setLiked(isPostLiked);
    } else {
      // TODO: Update the cache with the new like state once we have it.
    }
  }, []);
  const likeUnlikePostDebounced = useMemo(() => debounce(likeUnlikePost, 500), [likeUnlikePost]);

  // Function that is called when the user presses the like button
  // This immediately updates the local state to have a more responsive UI,
  // but then debounces the actual call to the server to avoid spamming it
  const addOrRemoveLike = useCallback(
    (p: Post) => {
      setLiked(value => !value);
      likeUnlikePostDebounced(p);
    },
    [likeUnlikePostDebounced],
  );

  return {
    liked,
    addOrRemoveLike,
  };
};

export default useAddOrRemoveLike;
