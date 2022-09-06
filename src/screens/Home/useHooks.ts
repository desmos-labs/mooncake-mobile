import {useNavigation} from '@react-navigation/native';
import {useGetFollowing} from '@recoil/following';
import {useGetPosts} from '@recoil/posts';
import _ from 'lodash';
import ROUTES from 'navigation/routes';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions} from 'react-native';
import {NavProps, POST_TYPE} from 'screens/Home/index';
import {GrantEnums} from 'lib/desmos/msgtypes';
import useCheckGrants from 'hooks/authGrants/useCheckGrants';
import useLogin from 'services/axios/requests/Login/useLogin';
import {MMKVKEYS, useMMKVStorage} from 'lib/MMKVStorage';

/**
 * Hooks for the Home screen.
 */
const useHooks = () => {
  const {t} = useTranslation('home');
  const {posts, fetchNewPosts} = useGetPosts();
  const {following} = useGetFollowing();
  const maxOffset = React.useRef<number>(0);
  const {navigate, pop} = useNavigation<NavProps['navigation']>();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [selectedPostIndex, setSelectedPostIndex] = React.useState(0);
  const [activeAddress] = useMMKVStorage<string>(MMKVKEYS.ACTIVE_ACCOUNT_ADDR);
  const [bearerToken] = useMMKVStorage<string>(MMKVKEYS.REST_AUTH_TOKEN);

  const {checkGrants} = useCheckGrants();

  const postData = React.useMemo(() => {
    if (selectedIndex === 0) return posts;

    // Get the list of following accounts
    const followedAddresses = following.map(x => x.address);

    return _.filter(
      posts,
      x => followedAddresses.indexOf(x.author_address) !== -1,
    );
  }, [posts, following, selectedIndex]);

  // useLogin is called here instead of useHooks for better visibility.
  const {login} = useLogin();

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

  // recalculate max carousel offset. This value is used to determine if the
  // carousel has been overscrolled
  React.useEffect(() => {
    maxOffset.current =
      Math.floor(Dimensions.get('window').width * (posts.length - 1)) * -1;
  }, [posts.length]);

  // fetch new posts before the user reaches the last post so they
  // will be enslaved by the app forever
  const onPostChanged = React.useCallback(
    (index: number) => {
      setSelectedPostIndex(index);
      if (index >= posts.length - 2) {
        fetchNewPosts();
      }
    },
    [posts.length],
  );

  const postTypes = React.useMemo(() => {
    return [t(POST_TYPE.DISCOVER), t(POST_TYPE.FOLLOWING)];
  }, []);

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
      const followedAddresses = following.map(x => x.address);

      const grantsToRequest: GrantEnums[] = [
        GrantEnums.MsgCreateRelationship,
        GrantEnums.MsgDeleteRelationship,
      ];
      // check if user has grants first

      const grantsRequired = await checkGrants(grantsToRequest);

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
        console.log(address, followedAddresses);
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

  const onCarouselProgressChange = React.useCallback(
    (_temp: number, __: number, value: number) => {
      const offsetValue = value;
      // console.log(offsetValue, maxOffset.current);
      if (offsetValue > 0) {
        // do overscroll right things
      }
      if (offsetValue < maxOffset.current) {
        // do overscroll left things
      }
    },
    [maxOffset.current],
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

  return {
    handlePressDetails,
    handlePressFollow,
    handlePressAuthor,
    handlePressComments,
    handlePressProfile,
    handlePressTip,
    handlePressReactions,
    selectedIndex,
    setSelectedIndex,
    postTypes,
    onCarouselProgressChange,
    onPostChanged,
    postData,
  };
};

export default useHooks;
