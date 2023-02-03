import { AndroidColor } from '@notifee/react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import HomePostContentLoader from 'components/Loaders/HomePostContentLoader';
import Typography from 'components/Typography';
import ToastConfig from 'config/ToastConfig';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { BottomTabsParamList } from 'navigation/RootNavigator/BottomTabs';
import { HomeTabsParamList } from 'navigation/RootNavigator/HomeTabs';
import ROUTES from 'navigation/routes';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
import HomeItemSeparatorComponent from 'screens/Home/components/HomeItemSeparatorComponent';
import PostCard from 'screens/Home/components/PostCard';
import {
  useHandlePressComments,
  useHandlePressDetails,
  useHandlePressFollow,
  useHandlePressReaction,
  useHandlePressReport,
  useHandlePressTip,
} from 'screens/Home/hooks';
import useWatchForNewPosts from 'screens/Home/useWatchForNewPosts';
import { usePostsListState, useSetPostsListState } from '@recoil/screens/postsListState';
import useNavigateToProfile from 'hooks/useNavigateToProfile';
import { isPostPending, Post } from 'types/posts';
import useGetPosts, { PostsQueryType } from 'hooks/useGetPosts';
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

export interface HomeParams {
  readonly type: 'discover' | 'following';
}

/**
 * Home screen of the application that displays the list of posts the user is
 * currently viewing.
 * @constructor
 */
const Home = () => {
  const toast = useToast();
  const { t } = useTranslation();
  const styles = useStyles();
  const theme = useTheme();
  const { name: routeName } = useRoute<NavProps['route']>();

  // Reference and state of the post list, to be able to scroll to the top of it
  const postListRef = useRef<any>(null);
  const postsListState = usePostsListState();
  const setPostsListState = useSetPostsListState();

  // State to know whether the list end was reached during the momentum
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(false);

  // --- Actions ---
  const handleNavigateToProfile = useNavigateToProfile();
  const handlePressFollow = useHandlePressFollow();
  const handlePressDetails = useHandlePressDetails();
  const handlePressReaction = useHandlePressReaction();
  const handlePressReport = useHandlePressReport();
  const handlePressComments = useHandlePressComments();
  const handlePressTip = useHandlePressTip();

  // --- Data queries ---
  const postsQueryType = useMemo(() => {
    return routeName === 'HOME_DISCOVER' ? PostsQueryType.DISCOVERY : PostsQueryType.TIMELINE;
  }, [routeName]);

  const {
    posts,
    loading,
    fetchMore: fetchMorePosts,
    fetchingMore,
    refresh: refreshPosts,
    refreshing,
  } = useGetPosts(postsQueryType);

  // --- Notifications ---

  const handlePressNewPostNotification = useCallback(async () => {
    await refreshPosts();
    if (postListRef && postListRef.current) {
      postListRef.current.scrollToIndex({
        animated: true,
        index: 0,
      });
    }
  }, [postListRef, refreshPosts]);

  const resetNewPostNotificationState = useWatchForNewPosts(handlePressNewPostNotification);

  // --- Child components ---

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
              return toast.show(t('toast:postTxInProgress'), {
                type: ToastConfig.ERROR_NO_RETRY,
              });
            }
            handlePressDetails(item);
          }}
          onPressLike={() => {
            if (isPostPending(item)) {
              return toast.show(t('toast:postTxInProgress'), {
                type: ToastConfig.ERROR_NO_RETRY,
              });
            }
            handlePressReaction(item);
          }}
          onPressComment={() => {
            if (isPostPending(item)) {
              return toast.show(t('toast:postTxInProgress'), {
                type: ToastConfig.ERROR_NO_RETRY,
              });
            }
            handlePressComments(item);
          }}
          onPressTip={() => {
            if (isPostPending(item)) {
              return toast.show(t('toast:postTxInProgress'), {
                type: ToastConfig.ERROR_NO_RETRY,
              });
            }
            handlePressTip(item);
          }}
          onPressFollow={() => handlePressFollow(item.author.address)}
          onPressReport={() => {
            if (isPostPending(item) || !item.author) {
              return toast.show(t('toast:postTxInProgress'), {
                type: ToastConfig.ERROR_NO_RETRY,
              });
            }
            handlePressReport(item);
          }}
        />
      );
    },
    [
      handlePressFollow,
      handlePressReport,
      handleNavigateToProfile,
      handlePressDetails,
      handlePressComments,
      handlePressReaction,
      handlePressTip,
    ],
  );

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
  }, [fetchingMore]);

  // Function called when the user manually refreshes the list
  const onRefresh = useCallback(async () => {
    await refreshPosts();
    resetNewPostNotificationState();
  }, [refreshPosts, resetNewPostNotificationState]);

  // Little trick to scroll to top from a parent component, the HomeTabBar in this case
  useEffect(() => {
    if (postsListState.scrollToTop) {
      postListRef.current?.scrollToOffset({ animated: true, offset: 0 });
      setPostsListState(value => ({ ...value, scrollToTop: false }));
    }
  }, [postsListState, postListRef]);

  // View that represents the search bar
  const SearchView = useMemo(() => {
    return (
      postsListState.searchBarFocused && (
        <TouchableWithoutFeedback
          onPress={() => setPostsListState(value => ({ ...value, searchBarFocused: false }))}
          style={styles.searchView}>
          <View style={styles.absoluteView}>
            <Typography.Body6>
              We are Anonymous, we are legion, we do not forgive, we do not forget. Expect us.
            </Typography.Body6>
          </View>
        </TouchableWithoutFeedback>
      )
    );
  }, [postsListState]);

  // --- Component rendering ---

  // Return the loading view if the posts are still loading
  // TODO: If the view is NOT loading, and there are no posts, we should return an empty view
  // This might be the case if the user is offline and has no cached posts
  if (!posts && loading) {
    return (
      <View style={styles.loadingView}>
        <ActivityIndicator color={theme.colors.surfaceBlack} />
      </View>
    );
  }

  return (
    <>
      <View style={styles.homeView}>
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
          estimatedItemSize={497}
          ListFooterComponent={footerComponent}
          onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
          ItemSeparatorComponent={HomeItemSeparatorComponent}
          onEndReached={async () => {
            if (!onEndReachedCalledDuringMomentum) {
              await fetchMorePosts();
              setOnEndReachedCalledDuringMomentum(true);
            }
          }}
          onEndReachedThreshold={0.5}
        />
      </View>
      {SearchView}
    </>
  );
};

export default Home;
