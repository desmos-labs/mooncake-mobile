import { useNavigation } from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import React from 'react';
import { NavProps } from 'screens/Home';
import useFollowOrUnfollowUser from 'hooks/useFollowOrUnfollowUser';
import useAddOrRemoveReaction from 'hooks/useAddOrRemoveReaction';
import { isPostPending, Post } from 'types/posts';

/**
 * Hook that is called when the user presses the button to follow or unfollow another user.
 */
export const useHandlePressFollow = () => {
  const followOrUnfollow = useFollowOrUnfollowUser();
  return React.useCallback(followOrUnfollow, [followOrUnfollow]);
};

/**
 * Hook that is called when the user presses a single post in order to view its details.
 */
export const useHandlePressDetails = () => {
  const { navigate } = useNavigation<NavProps['navigation']>();
  return React.useCallback(
    (post: Post) => {
      if (isPostPending(post)) {
        // TODO: Instead of just returning here, tell the user why they can't do this, maybe with a modal
        return;
      }
      navigate(ROUTES.POST_DETAILS, {
        focusCommentBox: false,
        post,
      });
    },
    [isPostPending, navigate],
  );
};

/**
 * Hook that is called when the user wants to add a reaction to a post.
 */
export const useHandlePressReaction = () => {
  const addOrRemoveReaction = useAddOrRemoveReaction();
  return React.useCallback(
    async (post: Post) => {
      if (isPostPending(post)) {
        // TODO: Instead of just returning here, tell the user why they can't do this, maybe with a modal
        return;
      }
      await addOrRemoveReaction(post);
    },
    [isPostPending, addOrRemoveReaction],
  );
};

/**
 * Hook that allows to handle the press of the report button of a post.
 */
export const useHandlePressReport = () => {
  const { navigate } = useNavigation<NavProps['navigation']>();
  return React.useCallback(
    (post: Post) => {
      if (isPostPending(post)) {
        // TODO: Instead of just returning here, tell the user why they can't do this, maybe with a modal
        return;
      }
      navigate(ROUTES.REPORT_POST, {
        post,
      });
    },
    [isPostPending, navigate],
  );
};

export const useHandlePressComments = () => {
  const { navigate } = useNavigation<NavProps['navigation']>();
  return React.useCallback(
    (post: Post) => {
      if (isPostPending(post)) {
        // TODO: Instead of just returning here, tell the user why they can't do this, maybe with a modal
        return;
      }
      navigate(ROUTES.POST_DETAILS, {
        post,
        focusCommentBox: true,
      });
    },
    [isPostPending, navigate],
  );
};

export const useHandlePressTip = () => {
  const { navigate } = useNavigation<NavProps['navigation']>();
  return React.useCallback(
    (post: Post) => {
      if (isPostPending(post)) {
        // TODO: Instead of just returning here, tell the user why they can't do this, maybe with a modal
        return;
      }
      navigate(ROUTES.SEND_TIPS, {
        post,
      });
    },
    [isPostPending, navigate],
  );
};
