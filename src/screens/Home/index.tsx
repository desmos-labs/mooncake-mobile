import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { emptyListPlaceholder } from 'assets/images';
import HomePostContentLoader from 'components/Loaders/HomePostContentLoader';
import HomePostListContentLoader from 'components/Loaders/HomePostListContentLoader';
import PostCard from 'components/PostCard';
import { useGetPostType } from 'components/PostCard/hooks';
import usePosts, { PostsQueryType } from 'hooks/posts/usePosts';
import { useTheme } from 'native-base';
import ROUTES from 'navigation/routes';
import React, { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Platform, RefreshControl, View } from 'react-native';
import HomeItemSeparatorComponent from 'screens/Home/components/HomeItemSeparatorComponent';
import useWatchForNewPosts from 'screens/Home/useWatchForNewPosts';
import { Post } from 'types/posts';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<any, ROUTES.HOME_TAB_FOLLOWING | ROUTES.HOME_TAB_DISCOVER>;

/**
 * Home screen of the application that displays the list of posts the user is
 * currently viewing.
 * @constructor
 */
const Home = () => {
  const { t } = useTranslation('home');
  const styles = useStyles();
  const theme = useTheme();

  const { name: routeName } = useRoute<NavProps['route']>();

  // Reference and state of the post list, to be able to scroll to the top of it
  const postListRef = useRef<any>(null);

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

  const getPostType = useGetPostType();

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
      return <PostCard post={item} />;
    },
    [styles.loaderView],
  );

  // Function called when the user manually refreshes the list
  const onRefresh = useCallback(async () => {
    await refreshPosts();
  }, [refreshPosts]);

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

  const emptyComponent = useMemo(() => {
    return (
      <View style={styles.emptyView}>
        <Image source={emptyListPlaceholder} style={styles.emptyImage} />
        <Typography.Regular14>{t('no posts to display')}</Typography.Regular14>
      </View>
    );
  }, [styles, t]);

  // -------------------------------------------------------------------------------------
  // --- Component rendering
  // -------------------------------------------------------------------------------------

  // Return the loading view if the posts are still loading
  // This might be the case if the user is offline and has no cached posts
  if (loading) {
    return <HomePostListContentLoader />;
  }

  return (
    <View style={styles.homeView} testID="homeView">
      <FlashList
        keyExtractor={(item, index) => `${index}item+${item.id}`}
        ref={postListRef}
        data={posts}
        refreshControl={
          <RefreshControl
            tintColor={theme.colors.surfaceBlack}
            enabled
            onRefresh={onRefresh}
            refreshing={refreshing}
            progressViewOffset={Platform.OS === 'android' ? 30 : 0}
          />
        }
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={footerComponent}
        ListEmptyComponent={emptyComponent}
        estimatedItemSize={180}
        ItemSeparatorComponent={HomeItemSeparatorComponent}
        onEndReached={fetchMorePosts}
        getItemType={getPostType}
      />
    </View>
  );
};

export default Home;
