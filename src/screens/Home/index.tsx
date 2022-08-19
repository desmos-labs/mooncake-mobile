import React from 'react';
import {Dimensions, View, LogBox} from 'react-native';
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
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useNavigation} from '@react-navigation/native';
import useActiveAccount from 'hooks/useActiveAccount';
import _ from 'lodash';
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
  } = useHooks();

  const {profileData} = useActiveAccount();

  const renderPost = React.useCallback(
    (info: CarouselRenderItemInfo<any>) => {
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
          onPressFollow={() => handlePressFollow('')}
        />
      );
    },
    [postData],
  );

  const swipeUpGesture = React.useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .onEnd(event => {
          const {velocityX, velocityY} = event;

          if (Math.abs(velocityX) < 1000 && velocityY < -500) {
            handlePressComments();
          }
        }),
    [],
  );

  const handlePressReactions = React.useCallback(() => {
    navigate(ROUTES.POST_INTERACTION, {
      screen: ROUTES.POST_REACTIONS,
      params: {
        expandOnOpen: true,
        allowPanning: true,
      },
    });
  }, []);

  const handlePressComments = React.useCallback(() => {
    navigate(ROUTES.POST_INTERACTION, {
      screen: ROUTES.POST_COMMENTS,
      params: {
        expandOnOpen: true,
        allowPanning: true,
      },
    });
  }, []);

  const handlePressTip = React.useCallback(() => {
    navigate(ROUTES.POST_INTERACTION, {
      screen: ROUTES.POST_TIPS,
      params: {
        expandOnOpen: true,
        allowPanning: true,
      },
    });
  }, []);

  const handlePressProfile = React.useCallback(() => {
    navigate(ROUTES.USER_PROFILE);
  }, []);

  const profilePic = _.get(profileData, 'profile_pic');

  return (
    <GestureDetector gesture={swipeUpGesture}>
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
            onPress={handlePressComments}
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
    </GestureDetector>
  );
};

export default Home;
