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

  const [liked, setLiked] = React.useState(hasReacted);
  const addOrRemoveReaction = useAddOrRemoveReaction();
  const addOrRemovePostReactionDebounced = useMemo(
    () => debounce(addOrRemoveReaction, 500),
    [addOrRemoveReaction],
  );

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
