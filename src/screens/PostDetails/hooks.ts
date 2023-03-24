import React from 'react';
import { useNavigation } from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import { Keyboard } from 'react-native';
import { NavProps } from 'screens/PostDetails/index';
import { isCommentReply, Post } from 'types/posts';
import useCreatePost from 'hooks/posts/useCreatePost';
import useAddOrRemoveReaction from 'hooks/reactions/useAddOrRemoveReaction';
import { DesmosProfile } from 'types/desmos';
import useFollowOrUnfollowUser from 'hooks/relationships/useFollowOrUnfollowUser';
import { TipTargetType } from 'types/tips';
import useNavigateToPost from 'hooks/navigation/useNavigateToPost';
import { useTranslation } from 'react-i18next';
import useCustomToast from 'hooks/extended/useCustomToast';

/**
 * Hook that allows to report a user.
 */
export const useHandlePressReportUser = () => {
  return React.useCallback((user: DesmosProfile) => {
    // TODO: Implement this
    console.log('useHandlePressReportUser', user);
  }, []);
};

/**
 * Hook that allows to follow or unfollow a user.
 */
export const useHandlePressFollowOrUnfollow = () => {
  const followOrUnfollow = useFollowOrUnfollowUser();
  return React.useCallback(
    async (user: DesmosProfile) => {
      await followOrUnfollow(user);
    },
    [followOrUnfollow],
  );
};

/**
 * Hook that allows to handle the action performed when the user clicks on a comment.
 */
export const useHandlePressShowCommentDetails = () => {
  const navigateToPost = useNavigateToPost();
  return React.useCallback(
    (comment: Post) => {
      switch (isCommentReply(comment)) {
        case true:
          // If the post is a reply to a comment, do nothing
          return;
        default:
          // If the post is a comment to a post, navigate to its details
          navigateToPost(comment.subspaceId, comment.id, { navigationMethod: 'push' });
      }
    },
    [navigateToPost],
  );
};

/**
 * Hook that allows to see the comment details when a user wants to create a comment.
 */
export const useHandleExpandCommentView = () => {
  const { navigate } = useNavigation<NavProps['navigation']>();
  return React.useCallback(
    (post: Post) => {
      navigate(ROUTES.POST_CREATE, {
        parent: post,
      });
    },
    [navigate],
  );
};

/**
 * Hook that allows to handle the creation of a comment.
 */
export const useHandleCreateComment = () => {
  const { state, createPost } = useCreatePost();
  const { t } = useTranslation('postDetails');
  const toast = useCustomToast();
  const handleCreateComment = React.useCallback(
    async (post: Post) => {
      // When the user clicks on the button, dismiss the keyboard
      Keyboard.dismiss();
      const result = await createPost(post);
      if (result.isErr()) {
        console.error('Error inside useHandleCreateComment', result.error.message);
        return toast.errorNoRetry(t('failed to post comment'));
      }
    },
    [createPost, t, toast],
  );

  return {
    state,
    handleCreateComment,
  };
};

/**
 * Hook that allows to handle the addition or removal of a reaction from a post.
 */
export const useHandlePressReaction = () => {
  const addOrRemoveReaction = useAddOrRemoveReaction();
  return React.useCallback(
    async (post: Post) => {
      await addOrRemoveReaction(post);
    },
    [addOrRemoveReaction],
  );
};

/**
 * Hook that allows to handle the reporting of a post.
 */
export const useHandlePressReportPost = () => {
  const { navigate } = useNavigation<NavProps['navigation']>();
  return React.useCallback(
    (post: Post) => {
      navigate(ROUTES.POST_REPORT, { post });
    },
    [navigate],
  );
};

/**
 * Hook that allows to handle the sending of tips to a post.
 */
export const useHandlePressSendTips = () => {
  const { navigate } = useNavigation<NavProps['navigation']>();
  return React.useCallback(
    (post: Post) => {
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
 * Hook that allows to handle the press of the post counters.
 */
export const useHandlePressCounters = () => {
  const { navigate } = useNavigation<NavProps['navigation']>();
  return React.useCallback(
    (post: Post) => {
      navigate(ROUTES.POST_INTERACTION, {
        screen: ROUTES.POST_REACTIONS,
        params: {
          post,
        },
      });
    },
    [navigate],
  );
};
