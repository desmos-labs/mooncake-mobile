import {useLazyQuery} from '@apollo/client';
import EnvConfig from 'config/EnvConfig';
import {
  CompositeScreenProps,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {GrantEnums} from 'lib/desmos/msgtypes';
import useGetPosts from 'hooks/useGetPosts';
import ROUTES from 'navigation/routes';
import React, {useCallback} from 'react';
import {MMKVKEYS, useMMKVStorage} from 'lib/MMKVStorage';
import {Dimensions} from 'react-native';
import useCheckAndUpdateGrants from 'hooks/authGrants/useCheckAndUpdateGrants';
import {useToast} from 'react-native-toast-notifications';
import ToastConfig from 'config/ToastConfig';
import useManageReactions from 'services/axios/requests/CentralizedBroadcastTx/ManageReaction/useManageReactions';
import {useRecoilValue} from 'recoil';
import RefreshSession from 'services/axios/requests/RefreshSession';
import {GetReactionForPostAndAuthor} from 'services/graphql/queries/GetReactions';
import useFollowOrUnfollowUser from 'services/axios/requests/CentralizedBroadcastTx/ManageRelationship/useFollowOrUnfollowUser';
import pendingTxState from '@recoil/pendingTx/pendingTxState';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeTabsParamList} from 'navigation/RootNavigator/HomeTabs';
import {RootNavigatorParamList} from 'navigation/RootNavigator';

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

  const {manageReaction} = useManageReactions();
  const {checkAndUpdateGrants} = useCheckAndUpdateGrants();

  const toast = useToast();

  const prevOffsetValue = React.useRef(0);
  const overscrolling = React.useRef(false);

  const [getReactionForPostAndAuthor] = useLazyQuery(
    GetReactionForPostAndAuthor,
    {
      fetchPolicy: 'no-cache',
    },
  );

  const getReaction = useCallback(
    async ({
      id,
      subspace_id,
    }: {
      id: number;
      subspace_id: number;
      address: string;
    }) => {
      return getReactionForPostAndAuthor({
        variables: {
          postID: id,
          subspaceID: subspace_id,
          address: activeAddress!,
        },
      });
    },
    [activeAddress, getReactionForPostAndAuthor],
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
      const grantsToRequest: GrantEnums[] = [
        GrantEnums.MsgAddReaction,
        GrantEnums.MsgRemoveReaction,
      ];
      // check if user has grants first
      const {success} = await checkAndUpdateGrants({
        grantsToRequest,
        address: activeAddress!,
      });

      if (success) {
        const {data} = await getReaction({
          id: postId,
          subspace_id: EnvConfig.APP_SUBSPACE_ID,
          address: activeAddress!,
        });
        await manageReaction({
          postId,
          user: activeAddress!,
          reactionId: data?.reaction[0] ? data?.reaction[0].id : undefined,
        });
      } else {
        toast.show('[PLACEHOLDER]Authorization is required.', {
          type: ToastConfig.ERROR_NO_RETRY,
        });
      }
    },
    [activeAddress, checkAndUpdateGrants, getReaction, manageReaction, toast],
  );

  const handlePressComments = React.useCallback(() => {
    navigate(ROUTES.POST_DETAILS, {
      focusCommentBox: true,
      postId: posts[selectedPostIndex].id,
      subspaceID: posts[selectedPostIndex].subspace_id,
    });
  }, [selectedPostIndex, posts]);

  const handlePressTip = React.useCallback(
    (postAuthor: string, postId: number) => {
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
    posts,
    selectedPostIndex,
    onCarouselProgressChange,
  };
};

export default useHooks;
