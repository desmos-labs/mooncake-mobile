import { useNavigation, useRoute } from '@react-navigation/native';
import useGetPosts from 'hooks/useGetPosts';
import usePendingPosts from 'hooks/usePendingPosts';
import ROUTES from 'navigation/routes';
import React from 'react';
import { NavProps } from 'screens/Home';
import useFollowOrUnfollowUser from 'hooks/useFollowOrUnfollowUser';
import useAddOrRemoveReaction from 'hooks/useAddOrRemoveReaction';
import { isPostPending, Post } from 'types/posts';

const postFamilyMap = {
  [ROUTES.HOME_DISCOVER]: POST_TYPE.DISCOVER,
  [ROUTES.HOME_FOLLOWING]: POST_TYPE.FOLLOWING,
};

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

/**
 * Hooks for the Home screen.
 */
const hooks = () => {
  const { name: routeName } = useRoute<NavProps['route']>();
  const { navigate } = useNavigation<NavProps['navigation']>();
  const { parsedPendingPosts } = usePendingPosts();
  const { posts, fetchMorePosts, fetchNewestPosts, loading, refetching, fetchingMore } =
    useGetPosts({
      type: postFamilyMap[routeName],
    });

  // sort and combine pending posts with posts from API
  const combinedPosts: Partial<PostItem>[] = React.useMemo(() => {
    return [...parsedPendingPosts, ...posts];
  }, [JSON.stringify(posts), JSON.stringify(parsedPendingPosts)]);

  return {
    posts: combinedPosts,
    queryPostsData: posts,
    checkIfPostIsPending,
    loading,
    refetching,
    fetchingMore,
    fetchNewestPosts,
    fetchMorePosts,
  };
};

export default hooks;
