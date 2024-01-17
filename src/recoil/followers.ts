import React from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

/**
 * Atom that contains a user's followers.
 * The Record is used to keep an array of followers for each user.
 * Since the user's followers can reach a high number, we just keep
 * this in RAM to have a consistent UI when we follow/unfollow a user.
 */
const followersState = atom<Record<string, string[]>>({
  key: 'followersAppState',
  default: {},
});

/**
 * Hook that provides the list of addresses that the user is following.
 * NOTE: The list will be erased when the application closes.
 * @param user - The user address.
 */
// Ignore ts-prune error since we may need this in the future.
// ts-prune-ignore-next
export const useCachedUserFollowers = (user: string) => {
  const followers = useRecoilValue(followersState);
  return React.useMemo(() => followers[user] ?? [], [followers, user]);
};

/**
 * Hook that provides a function to update an user's followers.
 * NOTE: The list of followers will be erased when the application closes.
 */
// Ignore ts-prune error since we may need this in the future.
// ts-prune-ignore-next
export const useSetCachedUserFollowers = () => {
  const setCahcedFollowers = useSetRecoilState(followersState);

  return React.useCallback(
    (user: string, setOrUpdater: string[] | ((prev: string[]) => string[])) => {
      setCahcedFollowers(currentFollowers => {
        // Get the current user's follower.
        const userFollowers = currentFollowers[user] ?? [];
        // Obtain the new user's followers.
        const newFollowers =
          typeof setOrUpdater === 'function' ? setOrUpdater(userFollowers) : setOrUpdater;

        // If the value hasn't changed, do nothing.
        if (newFollowers === userFollowers) {
          return currentFollowers;
        }

        return {
          ...currentFollowers,
          [user]: newFollowers,
        };
      });
    },
    [setCahcedFollowers],
  );
};

/**
 * Hook that allows to know if the current user is following a given user or not.
 */
export const useCachedIsFollowingUser = (user: string, counterparty: string) => {
  const followers = useCachedUserFollowers(user);
  return React.useMemo(() => followers.includes(counterparty), [followers, counterparty]);
};

/**
 * Hook that provides a function to add or remove a user from the list
 * of users that the provided user is following.
 */
export const useUpdateUserFollowersCache = () => {
  const setCachedFollowers = useSetCachedUserFollowers();
  /**
   * Adds or removes a follower from the provided user's follower list.
   * @param user - The user address.
   * @param counterparty - The follower address.
   * @param add - Whether to add or remove the follower from the list
   * of followers.
   */
  return React.useCallback(
    (user: string, counterparty: string, add: boolean) => {
      setCachedFollowers(user, currentFollowers => {
        if (add && !currentFollowers.includes(counterparty)) {
          return [...currentFollowers, counterparty];
        } else if (!add && currentFollowers.includes(counterparty)) {
          return currentFollowers.filter(f => f !== counterparty);
        }

        return currentFollowers;
      });
    },
    [setCachedFollowers],
  );
};
