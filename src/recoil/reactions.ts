import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { areReactionsComparable, ComparableReaction, PostReaction } from 'types/desmos';
import { MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import React from 'react';
import { Post } from 'types/posts';
import { DataStatus, MultipleUsersCache } from 'types/cache';
import { mmkvValueToCache } from '@recoil/utils';
import { useStoredProfile } from '@recoil/profiles';

/**
 * Recoil atom that holds all the post reactions that are cached within the application.
 * Each list of reaction is associated to the address of the user that has added them.
 */
const reactionsState = atom<MultipleUsersCache<PostReaction, ComparableReaction>>({
  key: 'reactionsState',
  default: mmkvValueToCache(MMKVKEYS.POST_REACTIONS, areReactionsComparable),
  effects: [
    ({ onSet }) => {
      onSet(reactions => {
        setMMKV(MMKVKEYS.POST_REACTIONS, reactions.serialize());
      });
    },
  ],
});

/**
 * Hook that allows to add a new reaction on behalf of the user having a provided address,
 * to a post with a given id.
 */
export const useAddPostReaction = (user: string) => {
  const profile = useStoredProfile(user);
  if (!profile) {
    throw new Error('Cannot add reaction to post for user without profile');
  }

  const setReactions = useSetRecoilState(reactionsState);
  return React.useCallback(
    (post: Post) => {
      setReactions(currentReactions => {
        const existingReactions = currentReactions.get(user);
        const existingReaction = existingReactions.get({
          subspaceId: post.subspaceId,
          postId: post.id,
        });
        switch (existingReaction?.status) {
          case undefined:
            // The reaction does not exist in the cache, so add it
            return currentReactions.update(
              user,
              existingReactions.add({
                post,
                id: undefined,
                author: profile,
              }),
            );

          case DataStatus.DELETED_LOCALLY:
            // The reaction was deleted locally. Bring it back to CREATED
            return currentReactions.update(
              user,
              existingReactions.updateStatus(
                { subspaceId: post.subspaceId, postId: post.id },
                DataStatus.CREATED_LOCALLY,
              ),
            );

          default:
            // Do nothing in other cases
            return currentReactions;
        }
      });
    },
    [profile, setReactions, user],
  );
};

/**
 * Hook that allows to easily know if a reaction for a given post existing for a given user.
 */
export const useHasPostReaction = (user: string) => {
  const reactions = useRecoilValue(reactionsState);
  return React.useCallback(
    (subspaceId: number, postId: number) => {
      const userReactions = reactions.get(user);
      return userReactions.has({ subspaceId, postId });
    },
    [user, reactions],
  );
};

/**
 * Hook that allows to get the cached reaction for a given post.
 */
export const useGetPostReaction = (user: string) => {
  const reactions = useRecoilValue(reactionsState);
  return React.useCallback(
    (post: Post) => {
      const userReactions = reactions.get(user);
      return userReactions.get({ subspaceId: post.subspaceId, postId: post.id });
    },
    [user, reactions],
  );
};

/**
 * Hook that allows to get all the user's reactions that are stored locally and not yet synced.
 */
export const useGetReactionsToSync = () => {
  const reactions = useRecoilValue(reactionsState);
  return React.useCallback(
    (user: string) => {
      const userReactions = reactions.get(user);
      return userReactions.readAll().filter(reaction => reaction.status !== DataStatus.SYNCED);
    },
    [reactions],
  );
};

/**
 * Hook that allows to get a number representing the current difference of the reactions for the specified post.
 * The difference is computed by considering:
 * • each locally deleted reaction as <code>-1</code>
 * • each locally added reaction as <code>+1</code>
 *
 * Here are some difference values examples:
 * • a difference of -2 means that overall there are 2 locally deleted reactions
 * • a difference of +1 means that overall there is 1 locally deleted reaction
 *
 * This difference can be used to show an updated reactions count compared to the current values on the server.
 */
export const useGetPostReactionsDifference = (user: string) => {
  const reactions = useRecoilValue(reactionsState);
  return React.useCallback(
    (subspaceId: number, postId: number) => {
      const userReactions = reactions.get(user);
      return userReactions
        .readAll()
        .filter(reaction => reaction.post.subspaceId === subspaceId && reaction.post.id === postId)
        .map(reaction => {
          switch (reaction.status) {
            case DataStatus.CREATED_LOCALLY:
              return 1;
            case DataStatus.DELETED_LOCALLY:
              return -1;
            default:
              return 0;
          }
        })
        .reduce((sum: number, value: number) => sum + value, 0);
    },
    [reactions, user],
  );
};

/**
 * Hook that allows to get the reactions to be synced for a given post.
 * @param user {string} - Address of the user for which to get the reactions.
 */
export const useGetPostReactionsToSync = (user: string) => {
  const reactions = useRecoilValue(reactionsState);
  return React.useCallback(
    (subspaceId: number, postId: number) => {
      const userReactions = reactions.get(user);
      return userReactions.filterPending({ subspaceId, postId });
    },
    [reactions, user],
  );
};

/**
 * Hook that allows to set the local status of a post reaction.
 */
export const useUpdatePostReactionStatus = (user: string) => {
  const setReactions = useSetRecoilState(reactionsState);
  return React.useCallback(
    (post: Post, status: DataStatus) => {
      setReactions(currentReactions => {
        // Update the status of existing reaction
        const existingReactions = currentReactions.get(user);
        const updatedReactions = existingReactions.updateStatus(
          { subspaceId: post.subspaceId, postId: post.id },
          status,
        );
        return currentReactions.update(user, updatedReactions);
      });
    },
    [user, setReactions],
  );
};

/**
 * Hook that allows to update a stored pending reaction for a given post.
 * @param user {string} - Address of the user for which to update the reaction.
 */
export const useUpdatePendingPostReaction = (user: string) => {
  const setReactions = useSetRecoilState(reactionsState);
  return React.useCallback(
    (subspaceId: number, postId: number, update: PostReaction) => {
      setReactions(currentReactions => {
        const existingReactions = currentReactions.get(user);
        const updatedReactions = existingReactions.updatePending({ subspaceId, postId }, update);
        return currentReactions.update(user, updatedReactions);
      });
    },
    [user, setReactions],
  );
};

/**
 * Hook that allows to delete a stored pending reaction for a given user.
 * @param user {string} - Address of the user for which to delete the reaction.
 */
export const useRemovePendingPostReaction = (user: string) => {
  const setReactions = useSetRecoilState(reactionsState);
  return React.useCallback(
    (subspaceId: number, postId: number) => {
      setReactions(currentReactions => {
        const existingReactions = currentReactions.get(user);
        const updatedReactions = existingReactions.removePending({ subspaceId, postId });
        return currentReactions.update(user, updatedReactions);
      });
    },
    [user, setReactions],
  );
};

/**
 * Hook that allows to permanently delete the reaction to the post having the given id from the local storage.
 * <b>Note</b> By using this method, the reaction will be completely removed from the storage. If you want
 * to delete it only temporarily with the ability to revert it, please use {@link useUpdatePostReactionStatus} instead.
 */
export const useRemovePostReaction = (user: string) => {
  const setReactions = useSetRecoilState(reactionsState);
  return React.useCallback(
    (post: Post) => {
      setReactions(currentReactions => {
        const existingReactions = currentReactions.get(user);
        const updatedReactions = existingReactions.remove({
          subspaceId: post.subspaceId,
          postId: post.id,
        });
        return currentReactions.update(user, updatedReactions);
      });
    },
    [user, setReactions],
  );
};
