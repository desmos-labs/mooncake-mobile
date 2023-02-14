import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import { Keyboard } from 'react-native';
import { NavProps } from 'screens/PostDetails/index';
import { isCommentReply, Post } from 'types/posts';
import useCreatePost from 'hooks/useCreatePost';
import useAddOrRemoveReaction from 'hooks/useAddOrRemoveReaction';
import { DesmosProfile } from 'types/desmos';
import useFollowOrUnfollowUser from 'hooks/useFollowOrUnfollowUser';
import { Source } from 'react-native-fast-image';
import { TipTargetType } from 'types/tips';

/**
 * Hook that allows to report a user.
 * TODO: Implement this
 */
export const useHandlePressReportUser = () => {
  return React.useCallback((user: DesmosProfile) => {
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
      await followOrUnfollow(user.address);
    },
    [followOrUnfollow],
  );
};

/**
 * Hook that allows to handle the action performed when the user clicks on a comment.
 */
export const useHandlePressShowCommentDetails = () => {
  const { navigate } = useNavigation<NavProps['navigation']>();
  return React.useCallback(
    (comment: Post) => {
      if (isCommentReply(comment)) {
        // If the post is a reply to a comment, do nothing
        return;
      }

      // If the post is a comment to a post, navigate to its details
      navigate(ROUTES.POST_DETAILS, { post: comment });
    },
    [navigate],
  );
};

/**
 * Hook that allows to see the comment details when a user wants to create a comment.
 */
export const useHandleExpandCommentView = () => {
  const { navigate } = useNavigation<NavProps['navigation']>();
  return React.useCallback(
    (post: Post) => {
      navigate(ROUTES.CREATE_POST, {
        parent: post,
      });
    },
    [navigate],
  );
};

/**
 * Hook that allows to handle the creation of a comment.
 * @param post {Post} - Parent of the comment that will be created.
 */
export const useHandleCreateComment = (post: Post) => {
  const createPost = useCreatePost(post);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateComment = React.useCallback(async () => {
    setLoading(true);
    const result = await createPost();
    setLoading(false);

    if (result.isErr()) {
      // TODO: Show the error somewhat
      console.log('Error inside useHandleCreateComment', result.error.message);
      return;
    }

    Keyboard.dismiss();
  }, [createPost]);

  return {
    loading,
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
      navigate(ROUTES.REPORT_POST, { post });
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

/**
 * Hook that allows to handle the press of the post counters.
 * @param post {Post} - Post of which the counters' are pressed.
 */
export const useHandlePressCounters = (post: Post) => {
  const { navigate } = useNavigation<NavProps['navigation']>();
  return React.useCallback(() => {
    navigate(ROUTES.POST_INTERACTION, {
      screen: ROUTES.POST_REACTIONS,
      params: {
        post,
        expandOnOpen: true,
        allowPanning: true,
      },
    });
  }, [navigate, post]);
};

export const useReactorsAndTippersProfilePics = (post: Post) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [profilePics, setProfilePics] = useState<Source[]>([]);

  const refetch = React.useCallback(() => {
    // const countersImages = useMemo(() => {
    //   const reactionsImages = reactions.map((reaction: any) => {
    //     if (reaction.author.profile_pic) {
    //       return { uri: reaction.author.profile_pic };
    //     } else {
    //       return defaultProfilePic;
    //     }
    //   });
    //   const tipsImages = tips.map((tip: any) => {
    //     if (tip.sender.profile_pic) {
    //       return { uri: tip.sender.profile_pic };
    //     } else {
    //       return defaultProfilePic;
    //     }
    //   });
    //   return _.unionBy(reactionsImages, tipsImages, 'uri') as any[];
    // }, [reactions, tips]);
  }, []);

  return {
    loading,
    profilePics,
    refetch,
  };
};
