import {useNavigation, useRoute} from '@react-navigation/native';
import {POST_TYPE} from '@recoil/posts';
import EnvConfig from 'config/EnvConfig';
import useGetPosts from 'hooks/useGetPosts';
import useNavigateToProfile from 'hooks/useNavigateToProfile';
import ROUTES from 'navigation/routes';
import React from 'react';
import {NavProps} from 'screens/Home';
import useAddOrRemoveReaction from 'services/axios/requests/CentralizedBroadcastTx/useAddOrRemoveReaction';
import useFollowOrUnfollowUser from 'services/axios/requests/CentralizedBroadcastTx/useFollowOrUnfollow';
import usePendingPosts from 'hooks/usePendingPosts';

const postFamilyMap = {
  [ROUTES.HOME_DISCOVER]: POST_TYPE.DISCOVER,
  [ROUTES.HOME_FOLLOWING]: POST_TYPE.FOLLOWING,
};

/**
 * Hooks for the Home screen.
 */
const useHooks = () => {
  const {name: routeName} = useRoute<NavProps['route']>();
  const {handleNavigateToProfile} = useNavigateToProfile();
  const {navigate} = useNavigation<NavProps['navigation']>();
  const {addOrRemoveReaction} = useAddOrRemoveReaction();
  const {parsedPendingPosts} = usePendingPosts();
  const {
    posts,
    fetchMorePosts,
    fetchNewestPosts,
    loading,
    refetching,
    fetchingMore,
  } = useGetPosts({
    type: postFamilyMap[routeName],
  });

  const {followOrUnfollowUser} = useFollowOrUnfollowUser();

  // sort and combine pending posts with posts from API
  const combinedPosts: Partial<PostItem>[] = React.useMemo(() => {
    return [...parsedPendingPosts, ...posts];
  }, [JSON.stringify(posts), JSON.stringify(parsedPendingPosts)]);

  const checkIfPostIsPending = (postId: number) => {
    return parsedPendingPosts.find(x => x.id === postId)?.isPending;
  };

  const handlePressReport = React.useCallback(
    (postId: number, subspaceId: number) => {
      navigate(ROUTES.REPORT_POST, {
        postId,
        subspaceId,
      });
    },
    [],
  );

  const handlePressFollow = React.useCallback(
    async (address: string) => {
      const result = await followOrUnfollowUser({addrToFollow: address});
      console.log('Home/handlePressFollow result', result);
    },
    [followOrUnfollowUser],
  );

  const handlePressDetails = React.useCallback(
    (id: number, subspaceID: number) => {
      navigate({
        name: ROUTES.POST_DETAILS,
        params: {
          focusCommentBox: false,
          postId: id,
          subspaceID,
        },
      });
    },
    [],
  );

  const handleAddReaction = React.useCallback(
    async (postId: number) => {
      if (checkIfPostIsPending(postId)) return;

      const result = await addOrRemoveReaction({
        postId,
      });

      console.log(result);
    },
    [addOrRemoveReaction],
  );

  const handlePressComments = React.useCallback((postId: number) => {
    navigate(ROUTES.POST_DETAILS, {
      focusCommentBox: true,
      postId,
      subspaceID: EnvConfig.APP_SUBSPACE_ID,
    });
  }, []);

  const handlePressTip = React.useCallback(
    (postAuthor: string, postId: number) => {
      if (checkIfPostIsPending(postId)) return;
      navigate(ROUTES.SEND_TIPS, {postAuthor, postId});
    },
    [],
  );

  return {
    handlePressDetails,
    handlePressFollow,
    handleNavigateToProfile,
    handlePressTip,
    handleAddReaction,
    handlePressComments,
    handlePressReport,
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

export default useHooks;
