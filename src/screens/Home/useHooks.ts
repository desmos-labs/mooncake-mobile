import {useNavigation, useRoute} from '@react-navigation/native';
import {
  PendingPostEnum,
  pendingPostsState,
} from '@recoil/pendingTx/pendingPosts';
import {POST_TYPE} from '@recoil/posts';
import EnvConfig from 'config/EnvConfig';
import useGetPosts from 'hooks/useGetPosts';
import useNavigateToProfile from 'hooks/useNavigateToProfile';
import ROUTES from 'navigation/routes';
import React, {useCallback} from 'react';
import {useRecoilValue} from 'recoil';
import {NavProps} from 'screens/Home';
import useAddOrRemoveReaction from 'services/axios/requests/CentralizedBroadcastTx/useAddOrRemoveReaction';
import useFollowOrUnfollowUser from 'services/axios/requests/CentralizedBroadcastTx/useFollowOrUnfollow';

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
  const pendingPosts = useRecoilValue(pendingPostsState(PendingPostEnum.POST));
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

  const parsedPendingPosts = React.useMemo(() => {
    return pendingPosts
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(x => x.postData);
  }, [JSON.stringify(pendingPosts)]);

  // sort and combine pending posts with posts from API
  const combinedPosts: Partial<PostItem>[] = React.useMemo(() => {
    return [...parsedPendingPosts, ...posts];
  }, [JSON.stringify(posts), JSON.stringify(parsedPendingPosts)]);

  const checkIfPostIsPending = useCallback(
    (postId: number) => {
      return parsedPendingPosts.find(x => x.id === postId)?.isPending;
    },
    [parsedPendingPosts],
  );

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
    (id: number, subspaceId: number) => {
      if (checkIfPostIsPending(id)) return;
      navigate({
        name: ROUTES.POST_DETAILS,
        params: {
          focusCommentBox: false,
          postId: id,
          subspaceId,
        },
      });
    },
    [checkIfPostIsPending],
  );

  const handleAddReaction = React.useCallback(
    async (postId: number) => {
      if (checkIfPostIsPending(postId)) return;

      const result = await addOrRemoveReaction({
        postId,
      });

      console.log(result);
    },
    [addOrRemoveReaction, checkIfPostIsPending],
  );

  const handlePressComments = React.useCallback((postId: number) => {
    navigate(ROUTES.POST_DETAILS, {
      postId,
      subspaceId: EnvConfig.APP_SUBSPACE_ID,
      focusCommentBox: true,
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
