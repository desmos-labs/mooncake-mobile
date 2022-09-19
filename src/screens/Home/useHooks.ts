import {useNavigation} from '@react-navigation/native';
import {useGetFollowing} from '@recoil/following';
import {useGetPosts} from '@recoil/posts';
import _ from 'lodash';
import ROUTES from 'navigation/routes';
import React, {useCallback} from 'react';
import {NavProps} from 'screens/Home/index';
import {GrantEnums} from 'lib/desmos/msgtypes';
import useCheckGrants from 'hooks/authGrants/useCheckGrants';
import useLogin from 'services/axios/requests/Login/useLogin';
import {MMKVKEYS, useMMKVStorage} from 'lib/MMKVStorage';
import {Dimensions} from 'react-native';

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
  const maxOffset = React.useRef<number>(0);

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

  // useLogin is called here instead of useHooks for better visibility.
  const {login} = useLogin();

  // calculate carousel offset
  React.useEffect(() => {
    maxOffset.current =
      Math.floor(Dimensions.get('window').width * (posts.length - 1)) * -1;
  }, [posts.length]);

  // Check if we need to login the user
  React.useEffect(() => {
    if (bearerToken) return;
    login(activeAddress!).then(result => {
      if (result) {
        console.log('login successful');
        pop();
      }
    });
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
        navigate(ROUTES.USER_PROFILE, {});
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

  const handlePressReactions = React.useCallback(() => {
    console.log('like');
  }, []);

  const handlePressComments = React.useCallback(() => {
    navigate(ROUTES.POST_DETAILS, {
      focusCommentBox: true,
      postId: postData[selectedPostIndex].id,
      subspaceID: postData[selectedPostIndex].subspace_id,
    });
  }, [selectedPostIndex, postData]);

  const handlePressTip = React.useCallback(() => {
    navigate(ROUTES.SEND_TIPS);
  }, []);

  const handlePressProfile = React.useCallback(() => {
    navigate(ROUTES.USER_PROFILE, {});
  }, []);

  const handlePressCreatePost = React.useCallback(async () => {
    setLoading(true);

    const grantsToRequest: GrantEnums[] = [GrantEnums.MsgCreatePost];

    const grantsRequired = await checkGrants(grantsToRequest);
    setLoading(false);

    if (grantsRequired.length > 0) {
      navigate(ROUTES.ACTION_AUTHORIZATION, {
        grants: grantsRequired,

        onApprove: () => {
          // regular follow flow
          replace(ROUTES.CREATE_TEXT_POST);
        },
      });
    } else navigate(ROUTES.CREATE_TEXT_POST);
  }, []);

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
  // const onCarouselProgressChange = React.useCallback(
  //   _.throttle((_temp: number, __: number, value: number) => {
  //     const offsetValue = value;
  //     // console.log(offsetValue, maxOffset.current);
  //     if (offsetValue > 0) {
  //       console.log('fetch');
  //       // do overscroll right things
  //       onOverscrollRight();
  //     }
  //     if (offsetValue < maxOffset.current) {
  //       // do overscroll left things
  //     }
  //   }, 3000),
  //   [maxOffset.current],
  // );

  return {
    activeAddress,
    handlePressDetails,
    handlePressFollow,
    handlePressAuthor,
    handlePressComments,
    handlePressProfile,
    handlePressTip,
    handlePressReactions,
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
