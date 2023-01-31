import {atom, useRecoilValue, useSetRecoilState} from 'recoil';
import {DataStatus, PostID, PostReaction} from 'types/desmos';
import {getMMKV, MMKVKEYS, setMMKV} from 'lib/MMKVStorage';
import React from 'react';

/**
 * Recoil atom that holds all the post reactions that are cached within the application.
 * Each list of reaction is associated to the address of the user that has added them.
 */
const reactionsState = atom<Record<string, PostReaction[]>>({
  key: 'reactionsState',
  default: getMMKV(MMKVKEYS.POST_REACTIONS) || {},
  effects: [
    ({onSet}) => {
      onSet(reactions => {
        setMMKV(MMKVKEYS.POST_REACTIONS, reactions);
      });
    },
  ],
});

/**
 * Hook that allows to easily know if a reaction for a given post existing for a given user.
 */
export const useHasPostReaction = () => {
  const reactions = useRecoilValue(reactionsState);
  return React.useCallback(
    (user: string, postId: PostID) => {
      const userReactions = reactions[user] ?? [];
      const postReaction = userReactions.find(
        r => r.postId === postId && r.status !== DataStatus.DELETED_LOCALLY,
      );
      return postReaction !== undefined;
    },
    [reactions],
  );
};

/**
 * Hook that allows to set the local status of a post reaction.
 */
export const useSetPostReactionStatus = () => {
  const setReactions = useSetRecoilState(reactionsState);
  return React.useCallback(
    (user: string, postId: PostID, status: DataStatus) => {
      setReactions(currentReactions => {
        // Update the status of existing reaction
        const existingReactions = currentReactions[user] ?? [];
        const updatedReactions = existingReactions.map(reaction =>
          reaction.postId === postId
            ? ({
                postId: reaction.postId,
                status,
              } as PostReaction)
            : reaction,
        );

        // Store the new values
        const newReactions: Record<string, PostReaction[]> = {
          ...currentReactions,
        };
        newReactions[user] = updatedReactions;
        return newReactions;
      });
    },
    [setReactions],
  );
};

/**
 * Hook that allows to add a new reaction on behalf of the user having a provided address,
 * to a post with a given id.
 */
export const useAddPostReaction = () => {
  const setReactions = useSetRecoilState(reactionsState);
  return React.useCallback(
    (user: string, postId: PostID) => {
      setReactions(currentReactions => {
        // Add the reaction to the existing ones
        const existingReactions = currentReactions[user] ?? [];
        existingReactions.push({
          postId,
          status: DataStatus.CREATED_LOCALLY,
        } as PostReaction);

        const newReactions: Record<string, PostReaction[]> = {
          ...currentReactions,
        };
        newReactions[user] = existingReactions;
        return newReactions;
      });
    },
    [setReactions],
  );
};

/**
 * Hook that allows to permanently delete the reaction to the post having the given id from the local storage.
 * <b>Note</b> By using this method, the reaction will be completely removed from the storage. If you want
 * to delete it only temporarily with the ability to revert it, please use {@link useSetPostReactionStatus} instead.
 */
export const useRemovePostReaction = () => {
  const setReactions = useSetRecoilState(reactionsState);
  return React.useCallback(
    (user: string, postId: PostID) => {
      setReactions(currentReactions => {
        // Update the status of existing reaction
        const existingReactions = currentReactions[user] ?? [];
        const filteredReactions = existingReactions.filter(
          reaction => reaction.postId !== postId,
        );

        // Store the new values
        const newReactions: Record<string, PostReaction[]> = {
          ...currentReactions,
        };
        newReactions[user] = filteredReactions;
        return newReactions;
      });
    },
    [setReactions],
  );
};
