import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { PostReaction } from 'types/desmos';
import { MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import React from 'react';
import { Post } from 'types/posts';
import Cache, { DataStatus } from 'types/cache';
import { cacheToMMKV, mmkvValueToCache } from '@recoil/utils';

type ComparableReaction = Pick<PostReaction, 'subspaceId' | 'postId'>;

type ReactionsCache = Cache<PostReaction, ComparableReaction>;

const areReactionsEqual = (first: ComparableReaction, second: ComparableReaction): boolean => {
  return first.subspaceId === second.subspaceId && first.postId === second.postId;
};

/**
 * Recoil atom that holds all the post reactions that are cached within the application.
 * Each list of reaction is associated to the address of the user that has added them.
 */
const reactionsState = atom<Record<string, ReactionsCache>>({
  key: 'reactionsState',
  default: mmkvValueToCache(MMKVKEYS.POST_REACTIONS, areReactionsEqual),
  effects: [
    ({ onSet }) => {
      onSet(reactions => {
        setMMKV(MMKVKEYS.POST_REACTIONS, cacheToMMKV(reactions));
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
    (user: string, post: Post) => {
      const userReactions = reactions[user] ?? [];
      return userReactions.has({ subspaceId: post.subspaceId, postId: post.id });
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
    (user: string, post: Post, status: DataStatus) => {
      setReactions(currentReactions => {
        // Update the status of existing reaction
        const existingReactions = currentReactions[user] ?? [];
        existingReactions.updateStatus({ subspaceId: post.subspaceId, postId: post.id }, status);

        // Store the new values
        const newReactions: Record<string, ReactionsCache> = {
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
 * Hook that allows to add a new reaction on behalf of the user having a provided address,
 * to a post with a given id.
 */
export const useAddPostReaction = () => {
  const setReactions = useSetRecoilState(reactionsState);
  return React.useCallback(
    (user: string, post: Post) => {
      setReactions(currentReactions => {
        // Add the reaction to the existing ones
        const existingReactions = currentReactions[user] ?? [];
        existingReactions.add({
          subspaceId: post.subspaceId,
          postId: post.id,
        } as PostReaction);

        const newReactions: Record<string, ReactionsCache> = {
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
    (user: string, post: Post) => {
      setReactions(currentReactions => {
        // Update the status of existing reaction
        const existingReactions = currentReactions[user] ?? [];
        existingReactions.remove({ subspaceId: post.subspaceId, postId: post.id });

        // Store the new values
        const newReactions: Record<string, ReactionsCache> = {
          ...currentReactions,
        };
        newReactions[user] = existingReactions;
        return newReactions;
      });
    },
    [setReactions],
  );
};
