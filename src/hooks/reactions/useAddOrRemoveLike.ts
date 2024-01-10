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
  const [likesCount, setLikesCount] = React.useState(post.likesCount);
  // AbortController ref to cancel the request if needed.
  const abortControllerRef = React.useRef<AbortController>();

  // Update the local state when the server response changes
  React.useEffect(() => {
    setLiked(post.hasUserLiked);
    setLikesCount(post.likesCount);
  }, [post.hasUserLiked, post.likesCount]);

  // Debounce the add or remove reaction function to avoid spamming the server
  const likeUnlikePost = React.useCallback(
    async (p: Post, newLikeStatus: boolean) => {
      if (!activeAddress) {
        throw Error('Trying to adding or removing a post without an active address');
      }

      // Prevent the network request if the like status is the same as the current one.
      if (newLikeStatus === post.hasUserLiked) {
        return;
      }

      let error: Error | undefined;

      // We are going to perform a network request
      // Let's create a new AbortController to cancel the request.
      // This will be used to cancel the request if the user
      // performs another interaction to avoid unnecessary requests.
      abortControllerRef.current = new AbortController();
      if (!newLikeStatus) {
        // Post already liked, unlike it.
        const unlikeResult = await UnlikePost(p.id, abortControllerRef.current?.signal);
        if (unlikeResult.isErr()) {
          error = unlikeResult.error;
        }
      } else {
        // Post not liked, like it.
        const likeResult = await LikePost(p.id, abortControllerRef.current?.signal);
        if (likeResult.isErr()) {
          error = likeResult.error;
        }
      }
      // Network request completed, clear the AbortController.
      abortControllerRef.current = undefined;

      if (error) {
        // Restore the like status on error.
        setLiked(p.hasUserLiked);
        setLikesCount(p.likesCount);
        return;
      }

      // Update the cached post by setting the new hasUserLiked value
      storePost(activeAddress, {
        ...p,
        hasUserLiked: newLikeStatus,
        likesCount: p.likesCount + (newLikeStatus ? 1 : -1),
      });
    },
    [activeAddress, post.hasUserLiked, storePost],
  );
  const likeUnlikePostDebounced = useMemo(() => debounce(likeUnlikePost, 500), [likeUnlikePost]);

  // Function that is called when the user presses the like button
  // This immediately updates the local state to have a more responsive UI,
  // but then debounces the actual call to the server to avoid spamming it
  const addOrRemoveLike = useCallback(
    (p: Post) => {
      // If there is a previous request in progress, abort it.
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = undefined;
      }

      setLiked(!liked);
      setLikesCount(value => value + (liked ? -1 : 1));
      likeUnlikePostDebounced(p, !liked);
    },
    [likeUnlikePostDebounced, liked],
  );

  return {
    liked,
    addOrRemoveLike,
    likesCount,
  };
};

export default useAddOrRemoveLike;
