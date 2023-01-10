import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import postsListOptions from '@recoil/postsListRef';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';
import Typography from 'components/Typography';
import ToastConfig from 'config/ToastConfig';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import {BottomTabsParamList} from 'navigation/RootNavigator/BottomTabs';
import {HomeTabsParamList} from 'navigation/RootNavigator/HomeTabs';
import ROUTES from 'navigation/routes';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import ContentLoader, {Circle, Rect} from 'react-content-loader/native';
import {useTranslation} from 'react-i18next';
import {Dimensions, TouchableWithoutFeedback, View} from 'react-native';
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
  const lockPostPress = useRef(false);
  const [listOptions, setListOptions] = useRecoilState(postsListOptions);
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
          <View style={{flex: 1, marginHorizontal: theme.spacing.m}}>
            <ContentLoader
              animate={true}
              speed={2}
              width={Dimensions.get('window').width - 32}
              height={166}
              backgroundColor={theme.colors.surfaceGrey}
              foregroundColor={theme.colors.background}>
              <Rect x="64" y="18" rx="3" ry="3" width="88" height="8" />
              <Rect x="64" y="38" rx="3" ry="3" width="110" height="8" />
              <Rect x="6" y="66" rx="3" ry="3" width="320" height="8" />
              <Rect x="6" y="86" rx="3" ry="3" width="280" height="8" />
              <Rect x="6" y="106" rx="3" ry="3" width="330" height="8" />
              <Circle cx="30" cy="30" r="25" />
            </ContentLoader>
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
          style={{flex: 1, zIndex: 2}}>
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
      {SearchView}
      <View style={{flex: 1, zIndex: 1, backgroundColor: theme.colors.white}}>
        <FlashList
          keyExtractor={item => item.id.toString()}
          ref={postListRef}
          data={posts}
          refreshing={loading}
          onRefresh={onRefresh}
          renderItem={renderPost}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={388}
          getItemType={item => item.id}
          ItemSeparatorComponent={HomeItemSeparatorComponent}
          onEndReached={() => fetchMorePosts()}
        />
      </View>
    </>
  );
};

export default Home;
