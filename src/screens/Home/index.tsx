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
import React, {useCallback, useMemo} from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from 'react-native';
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

export type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.HOME_TABS
>;

export type HomeParams = {
  type: 'discover' | 'following';
};

const getItemLayout = (data: any, index: number) => ({
  length: Dimensions.get('window').width,
  offset: Dimensions.get('window').width * index,
  index,
});

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
    posts,
    selectedPostIndex,
    loading,
    fetchNewestPosts,
    fetchMorePosts,
    onViewableItemsChanged,
    checkIfPostIsPending,
  } = useHooks();

  const renderPost = React.useCallback(
    ({item}: ListRenderItemInfo<PostItem>) => {
      if (item.emptyComponent) {
        return (
          <View
            style={{
              width: Dimensions.get('window').width,
              padding: 24,
            }}>
            <NoMorePosts />
          </View>
        );
      }
      return (
        <View
          style={{
            width: Dimensions.get('window').width,
            padding: 24,
          }}>
          <PostCard
            author={item.author}
            isPending={item.isPending}
            attachments={item.attachments}
            text={item.text}
            id={item.id}
            onPressAuthor={() => handlePressAuthor(item.author_address)}
            onPressDetails={() => {
              if (checkIfPostIsPending(item.id)) {
                return toast.show(t('toast:postTxInProgress'), {
                  type: ToastConfig.ERROR_NO_RETRY,
                });
              }
              handlePressDetails(item.id, item.subspace_id);
            }}
            onPressFollow={() => handlePressFollow(item.author_address)}
          />
        </View>
      );
    },
    [handlePressFollow, handlePressAuthor, handlePressDetails],
  );

  const theme = useTheme();

  const viewabilityConfig = useMemo(() => {
    return {
      waitForInteraction: true,
      viewAreaCoveragePercentThreshold: 95,
    };
  }, []);

  const onScrollEndDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const xV = _.get(e, 'nativeEvent.velocity.x');
      if (xV > 2 && selectedPostIndex === 0) {
        fetchNewestPosts();
      }
    },
    [selectedPostIndex],
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}>
      <FlatList
        data={posts}
        horizontal
        pagingEnabled
        style={{
          flex: 1,
        }}
        renderItem={renderPost}
        windowSize={10}
        showsHorizontalScrollIndicator={false}
        // comment these 3 props when developing for a smoother experience
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScrollEndDrag={onScrollEndDrag}
        scrollEventThrottle={25}
        // comment end
        onEndReachedThreshold={3}
        onEndReached={fetchMorePosts}
        maxToRenderPerBatch={4}
        refreshing={loading}
        scrollToOverflowEnabled={false}
        overScrollMode="never"
        bounces={false}
        bouncesZoom={false}
        removeClippedSubviews={false}
        getItemLayout={getItemLayout}
      />

      {posts.length > 0 && selectedPostIndex !== posts.length && (
        <View style={styles.interactionButtonGroup}>
          <InteractionButton
            onPress={() => {
              if (checkIfPostIsPending(posts[selectedPostIndex].id)) {
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
              if (checkIfPostIsPending(posts[selectedPostIndex].id)) {
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
                checkIfPostIsPending(posts[selectedPostIndex].id) ||
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
