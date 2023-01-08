import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import postsListScrollToTop from '@recoil/postsListRef';
import {FlashList} from '@shopify/flash-list';
import {ListRenderItemInfo} from '@shopify/flash-list/src/FlashListProps';
import ToastConfig from 'config/ToastConfig';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import {HomeTabsParamList} from 'navigation/RootNavigator/HomeTabs';
import ROUTES from 'navigation/routes';
import React, {useCallback, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {useToast} from 'react-native-toast-notifications';
import {useRecoilState} from 'recoil';
import HomeItemSeparatorComponent from 'screens/Home/components/HomeItemSeparatorComponent';
import PostCard from 'screens/Home/components/PostCard';
import useHooks from 'screens/Home/useHooks';
import useWatchForNewPosts from 'screens/Home/useWatchForNewPosts';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {BottomTabsParamList} from 'navigation/RootNavigator/BottomTabs';
import useStyles from './useStyles';

type FollowingNavProps = CompositeScreenProps<
  StackScreenProps<HomeTabsParamList, ROUTES.HOME_FOLLOWING>,
  CompositeScreenProps<
    BottomTabScreenProps<BottomTabsParamList, ROUTES.HOME_TABS>,
    StackScreenProps<RootNavigatorParamList>
  >
>;

type DiscoverNavProps = CompositeScreenProps<
  StackScreenProps<HomeTabsParamList, ROUTES.HOME_DISCOVER>,
  CompositeScreenProps<
    BottomTabScreenProps<BottomTabsParamList, ROUTES.HOME_TABS>,
    StackScreenProps<RootNavigatorParamList>
  >
>;

export type NavProps = DiscoverNavProps | FollowingNavProps;

export type HomeParams = {
  type: 'discover' | 'following';
};

const Home = () => {
  const toast = useToast();
  const {t} = useTranslation();
  const styles = useStyles();
  const postListRef = useRef<any>(null);
  const lockPostPress = useRef(false);
  const [scrollToTop, setScrollToTop] = useRecoilState(postsListScrollToTop);
  const {
    handlePressDetails,
    handlePressFollow,
    handlePressAuthor,
    handlePressTip,
    handleAddReaction,
    handlePressComments,
    handlePressReport,
    posts,
    fetchNewestPosts,
    fetchMorePosts,
    checkIfPostIsPending,
    loading,
  } = useHooks();

  const handlePressNewPostNotification = useCallback(() => {
    fetchNewestPosts();
    if (postListRef && postListRef.current) {
      postListRef.current.scrollToIndex({
        animated: true,
        index: 0,
      });
    }
  }, [postListRef]);

  const {resetNewPostNotificationState} = useWatchForNewPosts(
    handlePressNewPostNotification,
  );

  const renderPost = React.useCallback(
    ({item}: ListRenderItemInfo<PostItem>) => {
      if (item.emptyComponent) {
        return (
          <View style={styles.lottieOuterView}>
            {/*            <ThemedLottieView
              style={styles.lottieView}
              autoPlay
              loop={true}
              source={loadingOrange}
              resizeMode="cover"
            /> */}
          </View>
        );
      }
      return (
        <PostCard
          author={item.author}
          isPending={item.isPending}
          attachments={item.attachments}
          text={item.text}
          id={item.id}
          reactionPresence={item.reactionPresence}
          commentPresence={item.commentPresence}
          tipPresence={item.tipPresence}
          reactions={item.reactions}
          repliesCount={item.repliesCount}
          creation_date={item.creation_date}
          onPressAuthor={() => handlePressAuthor(item.author_address)}
          onPressDetails={() => {
            if (lockPostPress.current) return;

            if (checkIfPostIsPending(item.id)) {
              return toast.show(t('toast:postTxInProgress'), {
                type: ToastConfig.ERROR_NO_RETRY,
              });
            }
            handlePressDetails(item.id, item.subspace_id);
          }}
          onPressLike={() => {
            if (checkIfPostIsPending(item.id)) {
              return toast.show(t('toast:postTxInProgress'), {
                type: ToastConfig.ERROR_NO_RETRY,
              });
            }
            handleAddReaction(item.id);
          }}
          onPressComment={() => {
            if (checkIfPostIsPending(item.id)) {
              return toast.show(t('toast:postTxInProgress'), {
                type: ToastConfig.ERROR_NO_RETRY,
              });
            }
            handlePressComments(item.id);
          }}
          onPressTip={() => {
            if (checkIfPostIsPending(item.id) || !item.author) {
              return toast.show(t('toast:postTxInProgress'), {
                type: ToastConfig.ERROR_NO_RETRY,
              });
            }
            handlePressTip(item.author!.address, item.id);
          }}
          onPressFollow={() => handlePressFollow(item.author_address)}
          onPressReport={() => {
            if (checkIfPostIsPending(item.id) || !item.author) {
              return toast.show(t('toast:postTxInProgress'), {
                type: ToastConfig.ERROR_NO_RETRY,
              });
            }
            handlePressReport(item.id, item.subspace_id);
          }}
        />
      );
    },
    [
      lockPostPress.current,
      handlePressFollow,
      handlePressReport,
      handlePressAuthor,
      handlePressDetails,
      handlePressComments,
      handleAddReaction,
      handlePressTip,
    ],
  );

  const onRefresh = useCallback(() => {
    fetchNewestPosts();
    resetNewPostNotificationState();
  }, [fetchNewestPosts, resetNewPostNotificationState]);

  /**
   * Little trick to scroll to top from a parent component, the HomeTabBar in this case
   */
  useEffect(() => {
    if (scrollToTop) {
      postListRef.current?.scrollToOffset({animated: true, offset: 0});
      setScrollToTop(false);
    }
  }, [scrollToTop, postListRef]);

  return (
    <View style={styles.homeView}>
      {/*      <FlatList
        ref={postListRef}
        data={posts}
        refreshing={loading}
        onRefresh={onRefresh}
        style={styles.flatlist}
        contentContainerStyle={styles.flatlistInner}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        onEndReached={fetchMorePosts}
        initialNumToRender={6}
        ItemSeparatorComponent={HomeItemSeparatorComponent}
      /> */}

      <FlashList
        ref={postListRef}
        data={posts}
        refreshing={loading}
        onRefresh={onRefresh}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        onEndReached={fetchMorePosts}
        estimatedItemSize={150}
        getItemType={item => {
          return item.id;
        }}
        ItemSeparatorComponent={HomeItemSeparatorComponent}
      />
    </View>
  );
};

export default Home;
