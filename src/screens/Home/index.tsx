import { AndroidColor } from '@notifee/react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
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
import hooks, {
  useHandlePressComments,
  useHandlePressDetails,
  useHandlePressFollow,
  useHandlePressReaction,
  useHandlePressReport,
} from 'screens/Home/hooks';
import useWatchForNewPosts from 'screens/Home/useWatchForNewPosts';
import { usePostsListState, useSetPostsListState } from '@recoil/screens/postsListState';
import useNavigateToProfile from 'hooks/useNavigateToProfile';
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
  const { t } = useTranslation();
  const styles = useStyles();
  const theme = useTheme();

  // Reference and state of the post list, to be able to scroll to the top of it
  const postListRef = useRef<any>(null);
  const postsListState = usePostsListState();
  const setPostsListState = useSetPostsListState();

  // Actions
  const handleNavigateToProfile = useNavigateToProfile();
  const handlePressFollow = useHandlePressFollow();
  const handlePressDetails = useHandlePressDetails();
  const handlePressReaction = useHandlePressReaction();
  const handlePressReport = useHandlePressReport();
  const handlePressComments = useHandlePressComments();

  const {
    posts,
    fetchNewestPosts,
    fetchMorePosts,
    checkIfPostIsPending,
    queryPostsData,
    loading,
    refetching,
    fetchingMore,
  } = hooks();

  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(false);

  const handlePressNewPostNotification = useCallback(async () => {
    await fetchNewestPosts();
    if (postListRef && postListRef.current) {
      postListRef.current.scrollToIndex({
        animated: true,
        index: 0,
      });
    }
  }, [postListRef, fetchNewestPosts]);

  const { resetNewPostNotificationState } = useWatchForNewPosts(handlePressNewPostNotification);

  const renderPost = React.useCallback(
    ({ item }: ListRenderItemInfo<Partial<PostItem> | PostItem>) => {
      if (!item) {
        return (
          <View style={styles.loaderView}>
            <HomePostContentLoader />
          </View>
        );
      }
      return (
        <PostCard
          author={item.author!}
          isPending={item.isPending}
          attachments={item.attachments!}
          text={item.text!}
          id={item.id!}
          reactionPresence={item.reactionPresence!}
          commentPresence={item.commentPresence!}
          tipPresence={item.tipPresence!}
          reactions={item.reactions!}
          repliesCount={item.repliesCount!}
          creation_date={item.creation_date!}
          onPressAuthor={() => handleNavigateToProfile(item.author_address!)}
          onPressDetails={() => {
            if (checkIfPostIsPending(item.id!)) {
              return toast.show(t('toast:postTxInProgress'), {
                type: ToastConfig.ERROR_NO_RETRY,
              });
            }
            handlePressDetails(item.id!, item.subspace_id!);
          }}
          onPressLike={() => {
            if (checkIfPostIsPending(item.id!)) {
              return toast.show(t('toast:postTxInProgress'), {
                type: ToastConfig.ERROR_NO_RETRY,
              });
            }
            handleAddReaction(item.id!);
          }}
          onPressComment={() => {
            if (checkIfPostIsPending(item.id!)) {
              return toast.show(t('toast:postTxInProgress'), {
                type: ToastConfig.ERROR_NO_RETRY,
              });
            }
            handlePressComments(item.id!);
          }}
          onPressTip={() => {
            if (checkIfPostIsPending(item.id!) || !item.author) {
              return toast.show(t('toast:postTxInProgress'), {
                type: ToastConfig.ERROR_NO_RETRY,
              });
            }
            handlePressTip(item.author!.address, item.id!);
          }}
          onPressFollow={() => handlePressFollow(item.author_address!)}
          onPressReport={() => {
            if (checkIfPostIsPending(item.id!) || !item.author) {
              return toast.show(t('toast:postTxInProgress'), {
                type: ToastConfig.ERROR_NO_RETRY,
              });
            }
            handlePressReport(item.id!, item.subspace_id!);
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
      handleAddReaction,
      handlePressTip,
      fetchingMore,
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
    await fetchNewestPosts();
    resetNewPostNotificationState();
  }, [fetchNewestPosts, resetNewPostNotificationState]);

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

  // Return the loading view if the posts are still loading
  if (!queryPostsData || !posts || loading) {
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
              refreshing={refetching}
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
