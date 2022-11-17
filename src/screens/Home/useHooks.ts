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
import useFollowOrUnfollowUser from 'services/axios/requests/CentralizedBroadcastTx/useFollowOrUnfollow';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeTabsParamList} from 'navigation/RootNavigator/HomeTabs';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import useAddOrRemoveReaction from 'services/axios/requests/CentralizedBroadcastTx/useAddOrRemoveReaction';
import {
  PendingPostEnum,
  pendingPostsState,
} from '@recoil/pendingTx/pendingPosts';
import EnvConfig from 'config/EnvConfig';
import {POST_TYPE} from '@recoil/posts';
import _ from 'lodash';

type DiscoverNavProps = CompositeScreenProps<
  StackScreenProps<HomeTabsParamList, ROUTES.HOME_DISCOVER>,
  StackScreenProps<RootNavigatorParamList>
>;

type FollowingNavProps = CompositeScreenProps<
  StackScreenProps<HomeTabsParamList, ROUTES.HOME_FOLLOWING>,
  StackScreenProps<RootNavigatorParamList>
>;

const postFamilyMap = {
  [ROUTES.HOME_DISCOVER]: POST_TYPE.DISCOVER,
  [ROUTES.HOME_FOLLOWING]: POST_TYPE.FOLLOWING,
};

/**
 * Hooks for the Home screen.
 */
const useHooks = () => {
  const {name: routeName} = useRoute<
    DiscoverNavProps['route'] | FollowingNavProps['route']
  >();

  const {navigate} = useNavigation<
    DiscoverNavProps['navigation'] | FollowingNavProps['navigation']
  >();
  const [selectedPostIndex, setSelectedPostIndex] = React.useState(0);
  const [activeAddress] = useMMKVStorage<string>(MMKVKEYS.ACTIVE_ACCOUNT_ADDR);
  const maxOffset = React.useRef<number>(0);

  const {addOrRemoveReaction} = useAddOrRemoveReaction();

  const pendingPosts = useRecoilValue(pendingPostsState(PendingPostEnum.POST));

  const {posts, fetchMorePosts, fetchNewestPosts} = useGetPosts({
    type: postFamilyMap[routeName],
  });

  const {followOrUnfollowUser} = useFollowOrUnfollowUser();

  const prevOffsetValue = React.useRef(0);
  const overscrolling = React.useRef(false);

  // sort and combine pending posts with posts from API
  const combinedPosts = React.useMemo(() => {
    const sortedPendingPosts = pendingPosts
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(x => x.postData);

    return [...sortedPendingPosts, ...posts];
  }, [posts, pendingPosts]);

  const checkIfPostIsPending = React.useCallback(
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

  /**
   * Overscroll detection to fetchNewPosts
   */
  const onCarouselProgressChange = _.throttle(
    (_temp: number, __: number, value: number) => {
      // only start detecting overscroll if user is on the left-most elements
      if (selectedPostIndex > 1) return;
      if (overscrolling.current && value === 0) {
        overscrolling.current = false;
      }

      if (prevOffsetValue.current > 25 && !overscrolling.current) {
        overscrolling.current = true;
        // do overscroll right things
        fetchNewestPosts();
      }
      prevOffsetValue.current = value;
    },
    100,
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
    checkIfPostIsPending,
  };
};

export default useHooks;
