import { Post } from 'types/posts';
import React, { useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import LikePost from 'services/axios/requests/LikePost';
import UnlikePost from 'services/axios/requests/UnlikePost';
import { useStorePost } from '@recoil/posts';
import { useActiveAccountAddress } from '@recoil/accounts';

/**
 * Hook that allows to properly implement the addition and removal of a post like.
 */
const useAddOrRemoveLike = (post: Post) => {
  const activeAddress = useActiveAccountAddress();

  const storePost = useStorePost();

  // Local state used to avoid the need to wait for the server response
  // and have a more responsive UI as soon as the user presses the like button
  const [liked, setLiked] = React.useState(post.hasUserLiked);

  // Update the local state when the server response changes
  React.useEffect(() => {
    setLiked(post.hasUserLiked);
  }, [post.hasUserLiked]);

  // Debounce the add or remove reaction function to avoid spamming the server
  const likeUnlikePost = React.useCallback(
    async (p: Post) => {
      if (!activeAddress) {
        throw Error('Trying to adding or removing a post without an active address');
      }

      let error: Error | undefined;

      if (p.hasUserLiked) {
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
        setLiked(p.hasUserLiked);
        return;
      }

      // Update the cached post by setting the new hasUserLiked value
      storePost(activeAddress, {
        ...p,
        hasUserLiked: !p.hasUserLiked,
      });
    },
    [activeAddress, storePost],
  );
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
