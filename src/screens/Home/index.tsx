import {StackScreenProps} from '@react-navigation/stack';
import {
  commentIcon,
  commentLikeEmptyIcon,
  tipIcon,
  commentLiked,
  tipIconTipped,
  commentIconCommented,
} from 'assets/images';
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
import _ from 'lodash';
import {useToast} from 'react-native-toast-notifications';
import ToastConfig from 'config/ToastConfig';
import {useTranslation} from 'react-i18next';
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
  const toast = useToast();
  const {t} = useTranslation();

  const {
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
    isPostPending,
  } = useHooks();

  const renderPost = React.useCallback(
    (info: CarouselRenderItemInfo<PostItem>) => {
      if (info.index === posts.length) {
        return <NoMorePosts />;
      }
      return (
        <PostCard
          postData={info.item}
          onPressAuthor={() => handlePressAuthor(info.item.author_address)}
          onPressDetails={() => {
            if (isPostPending(info.item.id)) {
              return toast.show(t('toast:postTxInProgress'), {
                type: ToastConfig.ERROR_NO_RETRY,
              });
            }
            handlePressDetails(info.item.id, info.item.subspace_id);
          }}
          onPressFollow={() => handlePressFollow(info.item.author_address)}
        />
      );
    },
    [posts, handlePressFollow, handlePressAuthor, handlePressDetails],
  );

  const theme = useTheme();

  const currentPost = posts[selectedPostIndex];

  console.log(_.get(currentPost, 'repliesCount.aggregate.count'));

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
        data={[...posts, 0 as any]}
        renderItem={renderPost}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
          failOffsetY: [-10, 10],
        }}
      />

      {posts.length > 0 && selectedPostIndex !== posts.length && (
        <View style={styles.interactionButtonGroup}>
          <InteractionButton
            onPress={() => {
              if (isPostPending(posts[selectedPostIndex].id)) {
                return toast.show(t('toast:postTxInProgress'), {
                  type: ToastConfig.ERROR_NO_RETRY,
                });
              }
              handlePressComments(posts[selectedPostIndex].id);
            }}
            interactionCount={_.get(
              posts[selectedPostIndex],
              'repliesCount.aggregate.count',
              0,
            )}
            icon={
              _.get(
                posts[selectedPostIndex],
                'repliesCount.aggregate.count',
                0,
              ) > 0
                ? commentIconCommented
                : commentIcon
            }
          />

          <InteractionButton
            onPress={() => {
              if (isPostPending(posts[selectedPostIndex].id)) {
                return toast.show(t('toast:postTxInProgress'), {
                  type: ToastConfig.ERROR_NO_RETRY,
                });
              }
              handleAddReaction(posts[selectedPostIndex].id);
            }}
            interactionCount={_.get(
              posts[selectedPostIndex],
              'reactions.length',
              0,
            )}
            icon={
              _.get(posts[selectedPostIndex], 'reactions.length', 0) > 0
                ? commentLiked
                : commentLikeEmptyIcon
            }
          />

          <InteractionButton
            onPress={() => {
              if (
                isPostPending(posts[selectedPostIndex].id) ||
                !posts[selectedPostIndex].author
              ) {
                return toast.show(t('toast:postTxInProgress'), {
                  type: ToastConfig.ERROR_NO_RETRY,
                });
              }
              handlePressTip(
                posts[selectedPostIndex].author!.address,
                posts[selectedPostIndex].id,
              );
            }}
            interactionCount={_.get(posts[selectedPostIndex], 'tips.length', 0)}
            icon={
              _.get(posts[selectedPostIndex], 'tips.length', 0) > 0
                ? tipIconTipped
                : tipIcon
            }
          />
        </View>
      )}
    </View>
  );
};

export default Home;
