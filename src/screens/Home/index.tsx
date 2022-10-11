import {StackScreenProps} from '@react-navigation/stack';
import {commentIcon, commentLikeEmptyIcon, tipIcon} from 'assets/images';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {Dimensions, LogBox, View} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {CarouselRenderItemInfo} from 'react-native-reanimated-carousel/src/types';
import {verticalScale} from 'react-native-size-matters';
import InteractionButton from 'screens/Home/components/InteractionButton';
import NoMorePosts from 'screens/Home/components/NoMorePosts';
import PostCard from 'screens/Home/components/PostCard';
import useHooks from 'screens/Home/useHooks';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

// This warning is emitted from react-native-reanimated-carousel, but it
// does not affect operation
LogBox.ignoreLogs([/Cannot record touch end without a touch start./]);

export type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.HOME_TABS
>;

export type HomeParams = {
  type: 'discover' | 'following';
};

const Home = () => {
  const styles = useStyles();

  const {
    handlePressDetails,
    handlePressFollow,
    handlePressAuthor,
    handlePressTip,
    handlePressReactions,
    handlePressComments,
    onPostChanged,
    postData,
    selectedPostIndex,
    onCarouselProgressChange,
  } = useHooks();

  const renderPost = React.useCallback(
    (info: CarouselRenderItemInfo<PostItem>) => {
      if (info.index === postData.length) {
        return <NoMorePosts />;
      }
      return (
        <PostCard
          postData={info.item}
          onPressAuthor={() => handlePressAuthor(info.item.author_address)}
          onPressDetails={() =>
            handlePressDetails(info.item.id, info.item.subspace_id)
          }
          onPressFollow={() => handlePressFollow(info.item.author_address)}
        />
      );
    },
    [postData, handlePressFollow, handlePressAuthor, handlePressDetails],
  );

  const theme = useTheme();

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
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

      {selectedPostIndex !== postData.length && (
        <View style={styles.interactionButtonGroup}>
          <InteractionButton
            onPress={() => handlePressComments()}
            interactionCount={10500}
            icon={commentIcon}
          />

          <InteractionButton
            onPress={handlePressReactions}
            interactionCount={100}
            icon={commentLikeEmptyIcon}
          />

          <InteractionButton
            onPress={handlePressTip}
            interactionCount={100000000}
            icon={tipIcon}
          />
        </View>
      )}
    </View>
  );
};

export default Home;
