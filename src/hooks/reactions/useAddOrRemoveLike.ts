import { Post } from 'types/posts';
import useHasReacted from 'hooks/reactions/useHasReacted';
import React, { useCallback, useMemo } from 'react';
import useAddOrRemoveReaction from 'hooks/reactions/useAddOrRemoveReaction';
import { debounce } from 'lodash';

/**
 * Hook that allows to properly implement the addition and removal of a post like.
 */
const useAddOrRemoveLike = (post: Post) => {
  const hasReacted = useHasReacted(post);

  // Local state used to avoid the need to wait for the server response
  // and have a more responsive UI as soon as the user presses the like button
  const [liked, setLiked] = React.useState(hasReacted);

  // Debounce the add or remove reaction function to avoid spamming the server
  const addOrRemoveReaction = useAddOrRemoveReaction();
  const addOrRemovePostReactionDebounced = useMemo(
    () => debounce(addOrRemoveReaction, 500),
    [addOrRemoveReaction],
  );

  // Function that is called when the user presses the like button
  // This immediately updates the local state to have a more responsive UI,
  // but then debounces the actual call to the server to avoid spamming it
  const addOrRemoveLike = useCallback(
    (p: Post) => {
      setLiked(value => !value);
      addOrRemovePostReactionDebounced(p);
    },
    [addOrRemovePostReactionDebounced],
  );

  return {
    liked,
    addOrRemoveLike,
  };
};

export default useAddOrRemoveLike;
