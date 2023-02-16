import { useNavigation } from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import React from 'react';
import { NavProps } from 'screens/Home';
import useFollowOrUnfollowUser from 'hooks/useFollowOrUnfollowUser';
import useAddOrRemoveReaction from 'hooks/useAddOrRemoveReaction';
import { isPostPending, Post } from 'types/posts';
import { TipTargetType } from 'types/tips';
import useNavigateToPost from 'hooks/useNavigateToPost';

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
  const navigateToPost = useNavigateToPost();
  return React.useCallback(
    (post: Post) => {
      if (isPostPending(post)) {
        // TODO: Instead of just returning here, tell the user why they can't do this, maybe with a modal
        return;
      }
      navigateToPost(post.subspaceId, post.id);
    },
    [navigateToPost],
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
    [addOrRemoveReaction],
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
    [navigate],
  );
};

/**
 * Hook that allows to handle the press of the comments button of a post.
 */
export const useHandlePressComments = () => {
  const navigateToPost = useNavigateToPost();
  return React.useCallback(
    (post: Post) => {
      if (isPostPending(post)) {
        // TODO: Instead of just returning here, tell the user why they can't do this, maybe with a modal
        return;
      }
      navigateToPost(post.subspaceId, post.id, { focusCommentBox: true });
    },
    [navigateToPost],
  );
};

/**
 * Hook that allows to handle the press of the tip button of a post.
 */
export const useHandlePressTip = () => {
  const { navigate } = useNavigation<NavProps['navigation']>();
  return React.useCallback(
    (post: Post) => {
      if (isPostPending(post)) {
        // TODO: Instead of just returning here, tell the user why they can't do this, maybe with a modal
        return;
      }
      navigate(ROUTES.SEND_TIPS, {
        target: {
          type: TipTargetType.POST,
          post,
        },
      });
    },
    [navigate],
  );
};
