import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import postsListOptions from '@recoil/postsListRef';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';
import HomePostContentLoader from 'components/Loaders/HomePostContentLoader';
import Typography from 'components/Typography';
import ToastConfig from 'config/ToastConfig';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import {BottomTabsParamList} from 'navigation/RootNavigator/BottomTabs';
import {HomeTabsParamList} from 'navigation/RootNavigator/HomeTabs';
import ROUTES from 'navigation/routes';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  RefreshControl,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useToast} from 'react-native-toast-notifications';
import {useRecoilState} from 'recoil';
import HomeItemSeparatorComponent from 'screens/Home/components/HomeItemSeparatorComponent';
import PostCard from 'screens/Home/components/PostCard';
import useHooks from 'screens/Home/useHooks';
import useWatchForNewPosts from 'screens/Home/useWatchForNewPosts';
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
  const theme = useTheme();
  const postListRef = useRef<any>(null);
  const [listOptions, setListOptions] = useRecoilState(postsListOptions);
  const {
    handlePressDetails,
    handlePressFollow,
    handleNavigateToProfile,
    handlePressTip,
    handleAddReaction,
    handlePressComments,
    handlePressReport,
    posts,
    fetchNewestPosts,
    fetchMorePosts,
    checkIfPostIsPending,
    loading,
    queryPostsData,
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
          <View style={{flex: 1, marginHorizontal: theme.spacing.m}}>
            <HomePostContentLoader />
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
          onPressAuthor={() => handleNavigateToProfile(item.author_address)}
          onPressDetails={() => {
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
      handlePressFollow,
      handlePressReport,
      handleNavigateToProfile,
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
    if (listOptions.scrollToTop) {
      postListRef.current?.scrollToOffset({animated: true, offset: 0});
      setListOptions({...listOptions, scrollToTop: false});
    }
  }, [listOptions.scrollToTop, postListRef]);

  const SearchView = useMemo(() => {
    return (
      listOptions.searchBarFocused && (
        <TouchableWithoutFeedback
          onPress={() =>
            setListOptions({...listOptions, searchBarFocused: false})
          }
          style={styles.searchView}>
          <View style={styles.absoluteView}>
            <Typography.Body6>
              We are Anonymous, we are legion, we do not forgive, we do not
              forget. Expect us.
            </Typography.Body6>
          </View>
        </TouchableWithoutFeedback>
      )
    );
  }, [listOptions]);

  return (
    <>
      {queryPostsData ? (
        <View style={styles.homeView}>
          <FlashList
            keyExtractor={item => item.id.toString()}
            ref={postListRef}
            data={posts}
            refreshControl={
              <RefreshControl
                enabled
                onRefresh={onRefresh}
                refreshing={loading}
              />
            }
            renderItem={renderPost}
            showsVerticalScrollIndicator={false}
            estimatedItemSize={388}
            getItemType={item => item.id}
            ItemSeparatorComponent={HomeItemSeparatorComponent}
            onEndReached={() => fetchMorePosts()}
          />
        </View>
      ) : (
        <View style={styles.loadingView}>
          <ActivityIndicator />
        </View>
      )}
      {SearchView}
    </>
  );
};

export default Home;
