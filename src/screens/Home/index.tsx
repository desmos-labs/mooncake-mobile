import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { usePostsListState, useSetPostsListState } from '@recoil/screens/postsListState';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { emptyListPlaceholder } from 'assets/images';
import HomePostContentLoader from 'components/Loaders/HomePostContentLoader';
import PostCard from 'components/PostCard';
import { useGetPostType } from 'components/PostCard/hooks';
import { Image } from 'expo-image';
import usePosts, { PostsQueryType } from 'hooks/posts/usePosts';
import { useTheme } from 'native-base';
import ROUTES from 'navigation/routes';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, RefreshControl, View } from 'react-native';
import HomeItemSeparatorComponent from 'screens/Home/components/HomeItemSeparatorComponent';
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
  const postListState = usePostsListState();
  const setPostListState = useSetPostsListState();

  // Reference and state of the post list, to be able to scroll to the top of it
  const postListRef = useRef<FlashList<Post> | null>(null);
  const [, setContentOffset] = useState({
    x: 0,
    y: 0,
  });

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
    fetchingMore: fetchingMorePosts,
    refresh: refreshPosts,
    refreshing,
  } = usePosts(postsQueryType);

  // -------------------------------------------------------------------------------------
  // --- Utility functions
  // -------------------------------------------------------------------------------------
  const fetchTimestampRef = useRef<Date>();
  const getPostType = useGetPostType();

  useEffect(() => {
    if (postListState.scrollToTop) {
      if (postListRef?.current) {
        postListRef.current.scrollToIndex({
          animated: true,
          index: 0,
        });
      }
      setPostListState(val => ({ ...val, scrollToTop: false }));
    }
  }, [postListState.scrollToTop, setPostListState]);

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
      return <PostCard post={item} fetchTimestamp={fetchTimestampRef.current} />;
    },
    [styles.loaderView],
  );

  // Function called when the user manually refreshes the list
  const onRefresh = useCallback(async () => {
    fetchTimestampRef.current = new Date();
    await refreshPosts();
  }, [refreshPosts]);

  const footerComponent = useMemo(() => {
    if (loading || fetchingMorePosts) {
      return (
        <View style={styles.loaderView}>
          <HomePostContentLoader />
        </View>
      );
    } else {
      return null;
    }
  }, [styles, loading, fetchingMorePosts]);

  const emptyComponent = useMemo(() => {
    return !loading && !refreshing && !fetchingMorePosts ? (
      <View style={styles.emptyView}>
        <Image source={emptyListPlaceholder} style={styles.emptyImage} />
        <Typography.Regular14>{t('no posts to display')}</Typography.Regular14>
      </View>
    ) : null;
  }, [styles, t, loading, refreshing, fetchingMorePosts]);

  // -------------------------------------------------------------------------------------
  // --- Component rendering
  // -------------------------------------------------------------------------------------
  return (
    <View style={styles.homeView} testID="homeView">
      <FlashList
        keyExtractor={(item, index) => `${index}item+${item.externalId}`}
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
        estimatedItemSize={400}
        ItemSeparatorComponent={HomeItemSeparatorComponent}
        onEndReached={fetchMorePosts}
        getItemType={getPostType}
        onScroll={event => {
          setContentOffset(event.nativeEvent.contentOffset);
        }}
      />
    </View>
  );
};

export default Home;
