import { AndroidColor } from '@notifee/react-native';
import { useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import HomePostContentLoader from 'components/Loaders/HomePostContentLoader';
import Typography from 'components/Typography';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Platform, RefreshControl, View } from 'react-native';
import { useTheme } from 'native-base';
import useCustomToast from 'hooks/extended/useCustomToast';
import HomeItemSeparatorComponent from 'screens/Home/components/HomeItemSeparatorComponent';
import PostCard from 'screens/Home/components/PostCard';
import {
  useHandlePressComments,
  useHandlePressDetails,
  useHandlePressFollow,
  useHandlePressReport,
  useHandlePressTip,
} from 'screens/Home/hooks';
import useWatchForNewPosts from 'screens/Home/useWatchForNewPosts';
import { usePostsListState, useSetPostsListState } from '@recoil/screens/postsListState';
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
import { isPostPending, Post } from 'types/posts';
import usePosts, { PostsQueryType } from 'hooks/posts/usePosts';
import ROUTES from 'navigation/routes';
import { emptyListPlaceholder } from 'assets/images';
import useRequestNotificationsPermission from 'hooks/notifications/useRequestNotificationsPermission';
import SearchViewComponent from 'screens/Home/components/SearchViewComponent';
import HomePostListContentLoader from 'components/Loaders/HomePostListContentLoader';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<any, ROUTES.HOME_TAB_FOLLOWING | ROUTES.HOME_TAB_DISCOVER>;

/**
 * Home screen of the application that displays the list of posts the user is
 * currently viewing.
 * @constructor
 */
const Home = () => {
  const toast = useCustomToast();
  const { t } = useTranslation('home');
  const styles = useStyles();
  const theme = useTheme();

  const { name: routeName } = useRoute<NavProps['route']>();

  // Reference and state of the post list, to be able to scroll to the top of it
  const postListRef = useRef<any>(null);
  const postsListState = usePostsListState();
  const setPostsListState = useSetPostsListState();

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  // Ask the user the permission to access the device notification
  useRequestNotificationsPermission();

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const handleNavigateToProfile = useNavigateToProfile();
  const handlePressFollow = useHandlePressFollow();
  const handlePressDetails = useHandlePressDetails();
  const handlePressReport = useHandlePressReport();
  const handlePressComments = useHandlePressComments();
  const handlePressTip = useHandlePressTip();

  // -------------------------------------------------------------------------------------
  // --- Data queries
  // -------------------------------------------------------------------------------------

  const postsQueryType = useMemo(() => {
    return routeName === ROUTES.HOME_TAB_DISCOVER
      ? PostsQueryType.DISCOVERY
      : PostsQueryType.TIMELINE;
  }, [routeName]);

  const {
    posts,
    loading,
    fetchMore: fetchMorePosts,
    fetchingMore,
    refresh: refreshPosts,
    refreshing,
  } = usePosts(postsQueryType);

  // -------------------------------------------------------------------------------------
  // --- Notifications
  // -------------------------------------------------------------------------------------

  useWatchForNewPosts(
    useCallback(async () => {
      await refreshPosts();
      if (postListRef && postListRef.current) {
        postListRef.current.scrollToIndex({
          animated: true,
          index: 0,
        });
      }
    }, [postListRef, refreshPosts]),
  );

  // -------------------------------------------------------------------------------------
  // --- Utility functions
  // -------------------------------------------------------------------------------------

  const getPostType = useCallback((item: Post) => {
    if (item.attachments && item.attachments.length > 0 && item.text) {
      return 'text+media';
    }
    if (item.attachments && item.attachments.length > 0) {
      return 'media';
    }
    if (item.text) {
      return 'text';
    }
    return 'default';
  }, []);

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  const renderPost = React.useCallback(
    ({ item }: ListRenderItemInfo<Post>) => {
      if (!item) {
        return (
          <View style={styles.loaderView}>
            <HomePostContentLoader />
          </View>
        );
      }
      return (
        <PostCard
          post={item}
          onPressAuthor={() => handleNavigateToProfile(item.author.address)}
          onPressDetails={() => {
            if (isPostPending(item)) {
              return toast.success(t('toast:postTxInProgress'));
            }
            handlePressDetails(item);
          }}
          onPressComment={() => {
            if (isPostPending(item)) {
              return toast.success(t('toast:postTxInProgress'));
            }
            handlePressComments(item);
          }}
          onPressTip={() => {
            if (isPostPending(item)) {
              return toast.success(t('toast:postTxInProgress'));
            }
            handlePressTip(item);
          }}
          onPressFollow={() => handlePressFollow(item.author)}
          onPressReport={() => {
            if (isPostPending(item) || !item.author) {
              return toast.success(t('toast:postTxInProgress'));
            }
            handlePressReport(item);
          }}
        />
      );
    },
    [
      handleNavigateToProfile,
      handlePressComments,
      handlePressDetails,
      handlePressFollow,
      handlePressReport,
      handlePressTip,
      styles.loaderView,
      t,
      toast,
    ],
  );

  // Function called when the user manually refreshes the list
  const onRefresh = useCallback(async () => {
    await refreshPosts();
  }, [refreshPosts]);

  // Little trick to scroll to top from a parent component, the HomeTabBar in this case
  useEffect(() => {
    if (postsListState.scrollToTop) {
      postListRef.current?.scrollToOffset({ animated: true, offset: 0 });
      setPostsListState(value => ({ ...value, scrollToTop: false }));
    }
  }, [postsListState, postListRef, setPostsListState]);

  const footerComponent = useMemo(() => {
    if (fetchingMore) {
      return (
        <View style={styles.loaderView}>
          <HomePostContentLoader />
        </View>
      );
    } else {
      return null;
    }
  }, [fetchingMore, styles]);

  // -------------------------------------------------------------------------------------
  // --- Component rendering
  // -------------------------------------------------------------------------------------

  // Return the loading view if the posts are still loading
  // TODO: If the view is NOT loading, and there are no posts, we should return an empty view
  // This might be the case if the user is offline and has no cached posts
  if (loading) {
    return <HomePostListContentLoader />;
  }

  if (!loading && posts.length === 0) {
    return (
      <View style={styles.emptyView}>
        <Image source={emptyListPlaceholder} style={styles.emptyImage} />
        <Typography.Body6>{t('no posts to display')}</Typography.Body6>
      </View>
    );
  }

  return (
    <>
      <View style={styles.homeView} testID="homeView">
        <FlashList
          keyExtractor={(item, index) => `${index}item+${item.id}`}
          ref={postListRef}
          data={posts}
          refreshControl={
            <RefreshControl
              tintColor={theme.colors.surfaceBlack}
              colors={[AndroidColor.BLACK]}
              enabled
              onRefresh={onRefresh}
              refreshing={refreshing}
              progressViewOffset={Platform.OS === 'android' ? 30 : 0}
            />
          }
          renderItem={renderPost}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={footerComponent}
          estimatedItemSize={180}
          ItemSeparatorComponent={HomeItemSeparatorComponent}
          onEndReached={fetchMorePosts}
          getItemType={getPostType}
        />
      </View>
      {postsListState.searchBarFocused && (
        <SearchViewComponent valueToSearch={postsListState.valueToSearch} />
      )}
    </>
  );
};

export default Home;
