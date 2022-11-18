import {
  CompositeScreenProps,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import useGetPosts from 'hooks/useGetPosts';
import ROUTES from 'navigation/routes';
import React, {useCallback} from 'react';
import {MMKVKEYS, useMMKVStorage} from 'lib/MMKVStorage';
import {Dimensions, ViewToken} from 'react-native';
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

  const {posts, fetchMorePosts, fetchNewestPosts, loading} = useGetPosts({
    type: postFamilyMap[routeName],
  });

  const {followOrUnfollowUser} = useFollowOrUnfollowUser();

  const parsedPendingPosts = React.useMemo(() => {
    return pendingPosts
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(x => x.postData);
  }, [JSON.stringify(pendingPosts)]);

  // sort and combine pending posts with posts from API
  const combinedPosts = React.useMemo(() => {
    return [...parsedPendingPosts, ...posts, {emptyComponent: true} as any];
  }, [posts, pendingPosts]);

  const checkIfPostIsPending = (postId: number) => {
    return parsedPendingPosts.find(x => x.id === postId)?.isPending;
  };

  // calculate carousel offset
  React.useEffect(() => {
    maxOffset.current =
      Math.floor(Dimensions.get('window').width * (posts.length - 1)) * -1;
  }, [posts?.length]);

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

  const onViewableItemsChanged = useCallback(
    (a: {viewableItems: Array<ViewToken>; changed: Array<ViewToken>}) => {
      const index = _.get(a, 'viewableItems[0].index');
      if (index !== undefined) {
        setSelectedPostIndex(index);
      }
    },
    [],
  );

  return {
    handlePressDetails,
    handlePressFollow,
    handlePressAuthor,
    handlePressTip,
    handleAddReaction,
    handlePressComments,
    posts: combinedPosts,
    selectedPostIndex,
    checkIfPostIsPending,
    loading,
    fetchNewestPosts,
    fetchMorePosts,
    onViewableItemsChanged,
  };
};

export default useHooks;
