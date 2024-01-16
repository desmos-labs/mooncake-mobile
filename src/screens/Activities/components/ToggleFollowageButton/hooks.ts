import useFollowOrUnfollowUser from 'hooks/relationships/useFollowOrUnfollowUser';
import useIsFollowing from 'hooks/relationships/useIsFollowing';
import React from 'react';
import { DesmosProfile } from 'types/desmos';

/**
 * Hook that allows to toggle the follow/unfollow state of a user.
 */
// eslint-disable-next-line import/prefer-default-export
export const useToggleFollowage = (counterpartyProfile: DesmosProfile) => {
  const [following, setFollowing] = React.useState(false);
  const [updatingFollow, setUpdatingFollow] = React.useState(false);
  const { isFollowing, loading: fetchingFollowState } = useIsFollowing(counterpartyProfile.address);
  const followOrUnfollowUser = useFollowOrUnfollowUser();

  React.useEffect(() => {
    setFollowing(isFollowing);
  }, [isFollowing]);

  const toggleFollow = React.useCallback(async () => {
    setUpdatingFollow(true);
    const operationReference = await followOrUnfollowUser(counterpartyProfile);

    setFollowing(!following);
    const operationResult = await operationReference.getTaskResult();

    if (operationResult.isErr()) {
      // On error reset the following state to the initial value.
      setFollowing(following);
    }
    setUpdatingFollow(false);
  }, [counterpartyProfile, followOrUnfollowUser, following]);

  return {
    following,
    updatingFollow,
    toggleFollow,
    fetchingFollowState,
  };
};
