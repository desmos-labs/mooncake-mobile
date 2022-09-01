import React from 'react';
import {Dimensions, LogBox, View} from 'react-native';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import {
  commentIcon,
  createPost,
  defaultProfilePic,
  optionsIcon,
  tipIcon,
} from 'assets/images';
import Carousel from 'react-native-reanimated-carousel';
import {CarouselRenderItemInfo} from 'react-native-reanimated-carousel/src/types';
import PostCard from 'screens/Home/components/PostCard';
import DView from 'components/DView';
import InteractionButton from 'screens/Home/components/InteractionButton';
import {verticalScale} from 'react-native-size-matters';
import useHooks from 'screens/Home/useHooks';
import NoMorePosts from 'screens/Home/components/NoMorePosts';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useNavigation} from '@react-navigation/native';
import useActiveAccount from 'hooks/useActiveAccount';
import _ from 'lodash';
import useLogin from 'services/axios/requests/Login/useLogin';
import {MMKVKEYS, useMMKVStorage} from 'lib/MMKVStorage';
import PostTypeTab from './components/PostTypeTab';
import useStyles from './useStyles';

// This warning is emitted from react-native-reanimated-carousel, but it
// does not affect operation
LogBox.ignoreLogs([/Cannot record touch end without a touch start./]);

export enum POST_TYPE {
  DISCOVER = 'DISCOVER_POSTS',
  FOLLOWING = 'FOLLOWING_POSTS',
}

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.HOME>;

const Home = () => {
  const styles = useStyles();

  const {navigate} = useNavigation<NavProps['navigation']>();
  const [activeAddress] = useMMKVStorage<string>(MMKVKEYS.ACTIVE_ACCOUNT_ADDR);
  const [bearerToken] = useMMKVStorage<string>(MMKVKEYS.REST_AUTH_TOKEN);

  // useLogin is called here instead of useHooks for better visibility.
  const {login} = useLogin();

  React.useEffect(() => {
    // If there is already a bearer token, then there's no need to login.
    if (bearerToken) return;

    // placeholder to avoid eslint error
    console.log(activeAddress, login);

    // uncomment when ready
    // login(activeAddress!).then();
  }, []);

  const {
    handlePressDetails,
    handlePressFollow,
    handlePressAuthor,
    selectedIndex,
    setSelectedIndex,
    postTypes,
    onCarouselProgressChange,
    onPostChanged,
    postData,
    selectedPostIndex,
  } = useHooks();

  const {profileData} = useActiveAccount();

  const renderPost = React.useCallback(
    (info: CarouselRenderItemInfo<PostItem>) => {
      if (info.index === postData.length) {
        return <NoMorePosts />;
      }
      return (
        <PostCard
          postData={info.item}
          onPressAuthor={() => handlePressAuthor('')}
          onPressDetails={() =>
            handlePressDetails(info.item.id, info.item.subspace_id)
          }
          onPressFollow={() => handlePressFollow(info.item.author_address)}
        />
      );
    },
    [postData, handlePressFollow, handlePressAuthor, handlePressDetails],
  );

  const handlePressReactions = React.useCallback(() => {
    console.log('like');
  }, []);

  const handlePressComments = React.useCallback(
    ({postId, subspaceID}: {postId: number; subspaceID: number}) => {
      navigate(ROUTES.POST_DETAILS, {
        focusCommentBox: true,
        postId,
        subspaceID,
      });
    },
    [],
  );

  const handlePressTip = React.useCallback(() => {
    console.log('tips');
  }, []);

  const handlePressProfile = React.useCallback(() => {
    navigate(ROUTES.USER_PROFILE);
  }, []);

  const profilePic = _.get(profileData, 'profile_pic');

  return (
    <DView style={styles.container}>
      <View style={styles.headerGroup}>
        <ProfileHeaderButton
          imageSrc={profilePic ? {uri: profilePic} : defaultProfilePic}
          onPress={handlePressProfile}
        />

        <View style={styles.tabContainer}>
          <PostTypeTab
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            postTypes={postTypes}
          />
        </View>

        <ProfileHeaderButton
          style={styles.createPostButton}
          imageSrc={createPost}
          onPress={() => {
            console.log('create post');
          }}
        />
      </View>

      <Carousel
        onProgressChange={onCarouselProgressChange}
        onSnapToItem={onPostChanged}
        mode="parallax"
        loop={false}
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 60,
        }}
        width={Dimensions.get('window').width}
        height={verticalScale(500)}
        style={styles.carousel}
        data={[...postData, 0 as any]}
        renderItem={renderPost}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
          failOffsetY: [-10, 10],
        }}
      />

      <View style={styles.interactionButtonGroup}>
        <InteractionButton
          onPress={() =>
            handlePressComments({
              postId: postData[selectedPostIndex].id,
              subspaceID: postData[selectedPostIndex].subspace_id,
            })
          }
          interactionCount={10500}
          icon={commentIcon}
        />

        <InteractionButton
          onPress={handlePressReactions}
          interactionCount={100}
          icon={optionsIcon}
        />

        <InteractionButton
          onPress={handlePressTip}
          interactionCount={100000000}
          icon={tipIcon}
        />
      </View>
    </DView>
  );
};

export default Home;
