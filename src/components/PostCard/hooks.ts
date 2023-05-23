import { useNavigation } from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import React from 'react';
import { NavProps } from 'screens/Home';
import useFollowOrUnfollowUser from 'hooks/relationships/useFollowOrUnfollowUser';
import { isPostPending, Post } from 'types/posts';
import { TipTargetType } from 'types/tips';
import useNavigateToPost from 'hooks/navigation/useNavigateToPost';
import useHidePost from 'hooks/posts/useHidePost';
import useBlockOrUnblockUser from 'hooks/relationships/blocked/useBlockOrUnblockUser';

/**
 * Hook that is called when the user presses the button to follow or unfollow another user.
 */
export const useHandlePressFollow = () => {
  const followOrUnfollow = useFollowOrUnfollowUser();
  return React.useCallback(followOrUnfollow, [followOrUnfollow]);
};

export const useHandlePressBlock = () => {
  const blockOrUnblock = useBlockOrUnblockUser();
  return React.useCallback(blockOrUnblock, [blockOrUnblock]);
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
      navigateToPost(post.subspaceId, post.id, { initialPostData: post });
    },
    [navigateToPost],
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
      navigate(ROUTES.POST_REPORT, {
        post,
      });
    },
    [navigate],
  );
};

/**
 * A hook that handles the logic behind hiding a post on the home screen.
 */
export const useHandlePressHidePost = () => {
  const hidePost = useHidePost();

  return React.useCallback(
    (postID: number) => {
      hidePost(postID);
    },
    [hidePost],
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
      navigateToPost(post.subspaceId, post.id, { focusCommentBox: true, initialPostData: post });
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
      navigate(ROUTES.POST_SEND_TIPS, {
        target: {
          type: TipTargetType.POST,
          post,
        },
      });
    },
    [navigate],
  );
};

/**
 * A hook that exposes a function that returns the type of a given post.
 */
export const useGetPostType = () => {
  return React.useCallback((item: Post) => {
    if (item.attachments && item.attachments.length > 0 && item.text) {
      return 'text+media';
    }
    if (item.attachments && item.attachments.length > 0) {
      return 'media';
    }
    if (item.text) {
      return 'text';
    }
    return 'default';
  }, []);
};
