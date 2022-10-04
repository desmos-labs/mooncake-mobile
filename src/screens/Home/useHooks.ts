import {useLazyQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import {useGetFollowing} from '@recoil/following';
import {useGetPosts} from '@recoil/posts';
import EnvConfig from 'config/EnvConfig';
import _ from 'lodash';
import ROUTES from 'navigation/routes';
import React, {useCallback} from 'react';
import {NavProps} from 'screens/Home/index';
import {GrantEnums} from 'lib/desmos/msgtypes';
import useCheckGrants from 'hooks/authGrants/useCheckGrants';
import {MMKVKEYS, useMMKVStorage} from 'lib/MMKVStorage';
import {Dimensions} from 'react-native';
import {useResetRecoilState} from 'recoil';
import sharedPostState from '@recoil/sharedPostState';
import useCheckAndUpdateGrants from 'hooks/authGrants/useCheckAndUpdateGrants';
import {useToast} from 'react-native-toast-notifications';
import ToastConfig from 'config/ToastConfig';
import useManageReactions from 'services/axios/requests/CentralizedBroadcastTx/ManageReaction/useManageReactions';
import RefreshSession from 'services/axios/requests/RefreshSession';
import {GetReactionForPostAndAuthor} from 'services/graphql/queries/GetReactions';

/**
 * Hooks for the Home screen.
 */
const useHooks = () => {
  const {
    posts,
    fetchMorePosts,
    fetchNewestPosts,
    loading: postsLoading,
  } = useGetPosts();
  const {following} = useGetFollowing();
  const [selectedFilterIndex, setSelectedFilterIndex] = React.useState(0);
  const {navigate, pop, replace} = useNavigation<NavProps['navigation']>();
  const [selectedPostIndex, setSelectedPostIndex] = React.useState(0);
  const [activeAddress] = useMMKVStorage<string>(MMKVKEYS.ACTIVE_ACCOUNT_ADDR);
  const [bearerToken] = useMMKVStorage<string>(MMKVKEYS.REST_AUTH_TOKEN);
  const resetSharedPostState = useResetRecoilState(sharedPostState);
  const maxOffset = React.useRef<number>(0);
  const {manageReaction} = useManageReactions();
  const {checkAndUpdateGrants} = useCheckAndUpdateGrants();

  const toast = useToast();

  const prevOffsetValue = React.useRef(0);
  const overscrolling = React.useRef(false);

  const {checkGrants} = useCheckGrants();

  const [loading, setLoading] = React.useState(false);

  const postData = React.useMemo(() => {
    if (selectedFilterIndex === 0) return posts;

    // Get the list of following accounts
    const followedAddresses = following.map(x => x.address);

    return _.filter(
      posts,
      x => followedAddresses.indexOf(x.author_address) !== -1,
    );
  }, [posts, following, selectedFilterIndex]);

  const [getReactionForPostAndAuthor, {data: reactionAdded}] = useLazyQuery(
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
    [activeAddress],
  );

  // calculate carousel offset
  React.useEffect(() => {
    maxOffset.current =
      Math.floor(Dimensions.get('window').width * (posts.length - 1)) * -1;
  }, [posts.length]);

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
      if (index >= posts.length - 3) {
        fetchMorePosts();
      }
    },
    [posts.length],
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
      setLoading(true);
      const followedAddresses = following.map(x => x.address);

      // placeholder to avoid eslint error
      console.log(address, followedAddresses);

      const grantsToRequest: GrantEnums[] = [
        GrantEnums.MsgCreateRelationship,
        GrantEnums.MsgDeleteRelationship,
      ];
      // check if user has grants first

      const grantsRequired = await checkGrants(grantsToRequest);
      setLoading(false);

      if (grantsRequired.length > 0) {
        navigate(ROUTES.ACTION_AUTHORIZATION, {
          grants: grantsRequired,

          onApprove: () => {
            // regular follow flow
            console.log('approved');
            pop();
          },
          onCancel: () => {
            console.log('cancelled');
          },
        });
      } else {
        // regular follow flow
      }
    },
    [following],
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
    [activeAddress, reactionAdded],
  );

  const handlePressComments = React.useCallback(() => {
    navigate(ROUTES.POST_DETAILS, {
      focusCommentBox: true,
      postId: postData[selectedPostIndex].id,
      subspaceID: postData[selectedPostIndex].subspace_id,
    });
  }, [selectedPostIndex, postData]);

  const handlePressTip = React.useCallback((postAuthor: string) => {
    navigate(ROUTES.SEND_TIPS, {postAuthor});
  }, []);

  const handlePressProfile = React.useCallback(() => {
    navigate(ROUTES.USER_PROFILE);
  }, []);

  const handlePressCreatePost = React.useCallback(async () => {
    if (!activeAddress) return;

    resetSharedPostState();
    setLoading(true);

    const grantsToRequest: GrantEnums[] = [GrantEnums.MsgCreatePost];

    const {success} = await checkAndUpdateGrants({
      grantsToRequest,
      address: activeAddress,
    });
    setLoading(false);

    if (success) {
      navigate(ROUTES.CREATE_TEXT_POST);
    } else {
      toast.show('[PLACEHOLDER]Authorization is required.', {
        type: ToastConfig.ERROR_NO_RETRY,
      });
    }
  }, [activeAddress]);

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
    activeAddress,
    handlePressDetails,
    handlePressFollow,
    handlePressAuthor,
    handlePressComments,
    handlePressProfile,
    handlePressTip,
    handleAddReaction,
    selectedFilterIndex,
    setSelectedFilterIndex,
    handlePressCreatePost,
    onPostChanged,
    postData,
    selectedPostIndex,
    loading,
    onCarouselProgressChange,
  };
};

export default useHooks;
