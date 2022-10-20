import {
  CompositeScreenProps,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import useGetPosts from 'hooks/useGetPosts';
import ROUTES from 'navigation/routes';
import React, {useCallback} from 'react';
import {MMKVKEYS, useMMKVStorage} from 'lib/MMKVStorage';
import {Dimensions} from 'react-native';
import {useRecoilValue} from 'recoil';
import RefreshSession from 'services/axios/requests/RefreshSession';
import useFollowOrUnfollowUser from 'services/axios/requests/CentralizedBroadcastTx/useFollowOrUnfollow';
import pendingTxState from '@recoil/pendingTx/pendingTxState';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeTabsParamList} from 'navigation/RootNavigator/HomeTabs';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import useAddOrRemoveReaction from 'services/axios/requests/CentralizedBroadcastTx/useAddOrRemoveReaction';
import {pendingPostsState} from '@recoil/pendingTx/pendingPosts';
import EnvConfig from 'config/EnvConfig';

type DiscoverNavProps = CompositeScreenProps<
  StackScreenProps<HomeTabsParamList, ROUTES.HOME_DISCOVER>,
  StackScreenProps<RootNavigatorParamList>
>;

type FollowingNavProps = CompositeScreenProps<
  StackScreenProps<HomeTabsParamList, ROUTES.HOME_FOLLOWING>,
  StackScreenProps<RootNavigatorParamList>
>;

/**
 * Hooks for the Home screen.
 */
const useHooks = () => {
  const {params} = useRoute<
    DiscoverNavProps['route'] | FollowingNavProps['route']
  >();

  const {navigate, replace} = useNavigation<
    DiscoverNavProps['navigation'] | FollowingNavProps['navigation']
  >();
  const [selectedPostIndex, setSelectedPostIndex] = React.useState(0);
  const [activeAddress] = useMMKVStorage<string>(MMKVKEYS.ACTIVE_ACCOUNT_ADDR);
  const [bearerToken] = useMMKVStorage<string>(MMKVKEYS.REST_AUTH_TOKEN);
  const maxOffset = React.useRef<number>(0);

  const {addOrRemoveReaction} = useAddOrRemoveReaction();

  const pendingPosts = useRecoilValue(pendingPostsState);

  const {
    posts,
    fetchMorePosts,
    fetchNewestPosts,
    loading: postsLoading,
  } = useGetPosts({type: params.type});

  // debug use
  const pendingTx = useRecoilValue(pendingTxState);

  React.useEffect(() => {
    console.log('pending tx', pendingTx);
  }, [pendingTx]);

  const {followOrUnfollowUser} = useFollowOrUnfollowUser();

  const prevOffsetValue = React.useRef(0);
  const overscrolling = React.useRef(false);

  // sort and combine pending posts with posts from API
  const combinedPosts = React.useMemo(() => {
    const sortedPendingPosts = [...pendingPosts]
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(x => x.postData);

    return [...sortedPendingPosts, ...posts];
  }, [posts, pendingPosts]);

  const isPostPending = React.useCallback(
    (postId: number) => {
      return combinedPosts.find(x => x.id === postId)?.isPending;
    },
    [combinedPosts],
  );

  // calculate carousel offset
  React.useEffect(() => {
    maxOffset.current =
      Math.floor(Dimensions.get('window').width * (posts.length - 1)) * -1;
  }, [posts?.length]);

  // Refresh the token if we have one, otherwise have the user relog
  React.useEffect(() => {
    if (bearerToken) {
      RefreshSession();
    } else replace(ROUTES.LOGIN);
  }, []);

  // fetch new posts before the user reaches the last post so they
  // will be enslaved by the app forever
  const onPostChanged = React.useCallback(
    (index: number) => {
      setSelectedPostIndex(index);
      if (index >= posts.length - 5) {
        fetchMorePosts();
      }
    },
    [posts?.length],
  );

  const handlePressAuthor = useCallback(
    (address: string) => {
      if (activeAddress === address) {
        navigate(ROUTES.USER_PROFILE);
      } else {
        navigate(ROUTES.USER_PROFILE, {
          visitingProfileAddress: address,
        });
      }
    },
    [activeAddress],
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
      if (isPostPending(postId)) return;

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
      if (isPostPending(postId)) return;
      navigate(ROUTES.SEND_TIPS, {postAuthor, postId});
    },
    [],
  );

  // Throttle this function to max one call every 3 seconds
  const onOverscrollRight = React.useCallback(() => {
    fetchNewestPosts();
  }, [postsLoading]);

  const onCarouselProgressChange = React.useCallback(
    (_temp: number, __: number, value: number) => {
      const offsetValue = value;

      if (overscrolling.current && value === 0) {
        overscrolling.current = false;
      }

      if (prevOffsetValue.current > 25 && !overscrolling.current) {
        overscrolling.current = true;
        // do overscroll right things
        onOverscrollRight();
      }
      if (offsetValue < maxOffset.current) {
        // do overscroll left things
      }
      prevOffsetValue.current = value;
    },
    [maxOffset.current, prevOffsetValue.current, overscrolling.current],
  );

  return {
    handlePressDetails,
    handlePressFollow,
    handlePressAuthor,
    handlePressTip,
    handleAddReaction,
    handlePressComments,
    onPostChanged,
    posts: combinedPosts,
    selectedPostIndex,
    onCarouselProgressChange,
    isPostPending,
  };
};

export default useHooks;
