import React from 'react';
import {useGetPosts} from '@recoil/posts';
import {useGetFollowing} from '@recoil/following';
import _ from 'lodash';
import {Dimensions} from 'react-native';
import {POST_TYPE} from 'screens/Home/index';
import {useTranslation} from 'react-i18next';
import {APP_AUTHORIZATIONS} from 'lib/MMKVStorage/MMKVEnums';
import {useAppAuthorization} from '@recoil/appAuthorizationState';

/**
 * Hooks for the Home screen.
 */
const useHooks = () => {
  const {t} = useTranslation('home');

  const {requestAuthorization} = useAppAuthorization();

  const {posts, fetchNewPosts} = useGetPosts();
  const {following} = useGetFollowing();
  const maxOffset = React.useRef<number>(0);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const postData = React.useMemo(() => {
    if (selectedIndex === 0) return posts;

    // Get the list of following accounts
    const followedAddresses = following.map(x => x.address);

    return _.filter(
      posts,
      x => followedAddresses.indexOf(x.author_address) !== -1,
    );
  }, [posts, following, selectedIndex]);

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
      if (index >= posts.length - 2) {
        fetchNewPosts();
      }
    },
    [posts.length],
  );

  const postTypes = React.useMemo(() => {
    return [t(POST_TYPE.DISCOVER), t(POST_TYPE.FOLLOWING)];
  }, []);

  const handlePressAuthor = React.useCallback((address: string) => {
    console.log(address);
  }, []);

  const handlePressFollow = React.useCallback(async (address: string) => {
    await requestAuthorization(APP_AUTHORIZATIONS.FOLLOW_UNFOLLOW);

    console.log(address);
  }, []);

  const handlePressDetails = React.useCallback((postId: string) => {
    console.log(postId);
  }, []);

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

  return {
    handlePressDetails,
    handlePressFollow,
    handlePressAuthor,
    selectedIndex,
    setSelectedIndex,
    postTypes,
    onCarouselProgressChange,
    onPostChanged,
    postData,
  };
};

export default useHooks;
