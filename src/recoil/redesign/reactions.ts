import {atom, useRecoilValue, useSetRecoilState} from 'recoil';
import {PostID, PostReaction} from 'types/desmos';
import {getMMKV, MMKVKEYS, setMMKV} from 'lib/MMKVStorage';
import React from 'react';
import {useActiveAddress} from '@recoil/redesign/wallets';

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
const useHasPostReaction = () => {
  const reactions = useRecoilValue(reactionsState);
  return React.useCallback(
    (user: string, postId: PostID) => {
      const userReactions = reactions[user] ?? [];
      const postReaction = userReactions.find(r => r.postId === postId);
      return postReaction !== undefined;
    },
    [reactions],
  );
};

/**
 * Hook that allows to add a new reaction on behalf of the user having a provided address,
 * to a post with a given id.
 */
const useAddReaction = () => {
  const setReactions = useSetRecoilState(reactionsState);
  return React.useCallback(
    (user: string, postId: PostID) => {
      setReactions(currentReactions => {
        // Add the reaction to the existing ones
        const existingReactions = currentReactions[user] ?? [];
        existingReactions.push({
          postId,
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
 * Hook that allows to remove a reaction on behalf of the user having the provided address,
 * from the post with the given id.
 */
const useRemoveReaction = () => {
  const setReactions = useSetRecoilState(reactionsState);
  return React.useCallback(
    (user: string, postId: PostID) => {
      setReactions(currentReactions => {
        // Remove the existing reaction
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

/**
 * Hook that allows to easily know if the current application user has reacted to a post or not.
 */
export const useHasReacted = () => {
  const address = useActiveAddress();
  const hasReaction = useHasPostReaction();
  return React.useCallback(
    (postId: PostID) => {
      return address && hasReaction(address, postId);
    },
    [address, hasReaction],
  );
};

/**
 * Hook that allows to easily add or remove a reaction on behalf of the current application user.
 * based on whether that reaction does or not already exist.
 */
export const useAddOrRemoveReaction = () => {
  const activeAddress = useActiveAddress();

  const hasReaction = useHasPostReaction();
  const addReaction = useAddReaction();
  const removeReaction = useRemoveReaction();

  return React.useCallback(
    (postId: PostID) => {
      if (!activeAddress) {
        return;
      }

      // Add or remove the reaction based on whether it exists or not
      switch (hasReaction(activeAddress, postId)) {
        case false:
          addReaction(activeAddress, postId);
          break;
        case true:
          removeReaction(activeAddress, postId);
          break;
      }
    },
    [activeAddress, addReaction, removeReaction],
  );
};
