import React from 'react';
import {Dimensions, View, LogBox} from 'react-native';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import {commentIcon, moreIcon, optionsIcon, tipIcon} from 'assets/images';
import Carousel from 'react-native-reanimated-carousel';
import {CarouselRenderItemInfo} from 'react-native-reanimated-carousel/src/types';
import PostCard from 'screens/Home/components/PostCard';
import DView from 'components/DView';
import InteractionButton from 'screens/Home/components/InteractionButton';
import {verticalScale} from 'react-native-size-matters';
import useHooks from 'screens/Home/useHooks';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useNavigation} from '@react-navigation/native';
import useStyles from './useStyles';
import PostTypeTab from './components/PostTypeTab';

// This warning is emitted from react-native-reanimated-carousel, but it
// does not affect operation
LogBox.ignoreLogs([/Cannot record touch end without a touch start./]);

export enum POST_TYPE {
  DISCOVER = 'DISCOVER_POSTS',
  FOLLOWING = 'FOLLOWING_POSTS',
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.HOME>;

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

  const renderPost = React.useCallback((info: CarouselRenderItemInfo<any>) => {
    return (
      <PostCard
        postData={info.item}
        onPressAuthor={() => handlePressAuthor('')}
        onPressDetails={() => handlePressDetails('')}
        onPressFollow={() => handlePressFollow('')}
      />
    );
  }, []);

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
    // TODO: implementation
  }, []);

  return (
    <GestureDetector gesture={swipeUpGesture}>
      <DView style={styles.container}>
        <View style={styles.headerGroup}>
          <ProfileHeaderButton
            // TODO: replace this with user's image
            imageSrc={{uri: 'https://i.imgur.com/aih9snA.png'}}
            onPress={() => {
              console.log('shrek');
            }}
          />

          <View style={styles.tabContainer}>
            <PostTypeTab
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              postTypes={postTypes}
            />
          </View>

          <ProfileHeaderButton
            imageSrc={moreIcon}
            onPress={() => {
              console.log('more');
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
          data={postData}
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
