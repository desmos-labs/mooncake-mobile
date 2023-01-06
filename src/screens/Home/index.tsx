import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {loadingOrange} from 'assets/animations';
import ThemedLottieView from 'components/ThemedLottieView';
import ToastConfig from 'config/ToastConfig';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import {HomeTabsParamList} from 'navigation/RootNavigator/HomeTabs';
import ROUTES from 'navigation/routes';
import React, {useCallback, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, ListRenderItemInfo, View} from 'react-native';
import {useToast} from 'react-native-toast-notifications';
import PostCard from 'screens/Home/components/PostCard';
import useHooks from 'screens/Home/useHooks';
import useWatchForNewPosts from 'screens/Home/useWatchForNewPosts';
import useStyles from './useStyles';

export type NavProps = CompositeScreenProps<
  StackScreenProps<RootNavigatorParamList, ROUTES.HOME_TABS>,
  StackScreenProps<HomeTabsParamList>
>;

export type HomeParams = {
  type: 'discover' | 'following';
};

const Home = () => {
  const toast = useToast();
  const {t} = useTranslation();
  const styles = useStyles();
  const postListRef = useRef<any>();
  const lockPostPress = useRef(false);

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
            <ThemedLottieView
              style={styles.lottieView}
              autoPlay
              loop={true}
              source={loadingOrange}
              resizeMode="cover"
            />
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

  return (
    <View style={styles.homeView}>
      <FlatList
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
        maxToRenderPerBatch={6}
        windowSize={10}
        updateCellsBatchingPeriod={100}
      />
    </View>
  );
};

export default Home;
