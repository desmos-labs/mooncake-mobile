import useFollowOrUnfollowUser from 'hooks/relationships/useFollowOrUnfollowUser';
import useIsFollowing from 'hooks/relationships/useIsFollowing';
import React from 'react';
import { DesmosProfile } from 'types/desmos';

/**
 * Hook that allows to toggle the follow/unfollow state of a user.
 */
// eslint-disable-next-line import/prefer-default-export
export const useToggleFollowage = (counterpartyProfile: DesmosProfile) => {
  const [updatingFollow, setUpdatingFollow] = React.useState(false);
  const { isFollowing, loading: fetchingFollowState } = useIsFollowing(counterpartyProfile.address);
  const followOrUnfollowUser = useFollowOrUnfollowUser();

  const toggleFollow = React.useCallback(async () => {
    setUpdatingFollow(true);
    const operationReference = await followOrUnfollowUser(counterpartyProfile);
    await operationReference.getTaskResult();
    setUpdatingFollow(false);
  }, [counterpartyProfile, followOrUnfollowUser]);

  return {
    fetchingFollowState,
    following: isFollowing,
    updatingFollow,
    toggleFollow,
  };
};
