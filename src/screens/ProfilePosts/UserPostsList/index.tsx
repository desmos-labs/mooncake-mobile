import React, { useCallback } from 'react';
import { ListRenderItemInfo, Platform, RefreshControl, View } from 'react-native';
import { isPostPending, Post } from 'types/posts';
import { useTheme } from 'native-base';
import EmptyPostComponent from 'screens/Profile/components/EmptyPostComponent';
import StyledSpinner from 'components/StyledSpinner';
import { FlashList } from '@shopify/flash-list';
import HomePostContentLoader from 'components/Loaders/HomePostContentLoader';
import PostCard from 'screens/Home/components/PostCard';
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
import {
  useHandlePressComments,
  useHandlePressDetails,
  useHandlePressFollow,
  useHandlePressHidePost,
  useHandlePressReport,
  useHandlePressTip,
} from 'screens/Home/hooks';
import useCustomToast from 'hooks/extended/useCustomToast';
import { useTranslation } from 'react-i18next';
import { AndroidColor } from '@notifee/react-native';
import HomeItemSeparatorComponent from 'screens/Home/components/HomeItemSeparatorComponent';
import useStyles from './useStyles';

export interface UserPostsListProps {
  /**
   * List of posts to render.
   */
  posts: Post[];
  /**
   * Whether the data is loading or not.
   */
  isLoading: boolean;
  /**
   * Action to be performed when the user scrolls to the end of the list.
   */
  fetchMore: () => void;
  /**
   * Whether more data is being loaded or not.
   */
  fetchingMore: boolean;
  /**
   * Action to be performed when the user pulls down the list.
   */
  refreshPosts: () => void;
  /**
   * Whether the list is refreshing or not.
   */
  refreshing: boolean;
  /**
   * Text to be displayed when the list is empty.
   */
  emptyListText: string;
  /**
   * Text to be displayed on the button when the list is empty.
   */
  emptyListButtonText: string;
}

/**
 * React component that, given a list of posts and a variable telling whether the data is loading or not,
 * renders a list of posts.
 */
const UserPostsList = (props: UserPostsListProps) => {
  const styles = useStyles();

  const toast = useCustomToast();
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    posts,
    isLoading,
    fetchMore,
    // fetchingMore,
    refreshPosts,
    refreshing,
    emptyListText,
    emptyListButtonText,
  } = props;

  // const navigateToPost = useNavigateToPost();

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const handleNavigateToProfile = useNavigateToProfile();
  const handlePressFollow = useHandlePressFollow();
  const handlePressDetails = useHandlePressDetails();
  const handlePressReport = useHandlePressReport();
  const handlePressComments = useHandlePressComments();
  const handlePressTip = useHandlePressTip();
  const handlePressHidePost = useHandlePressHidePost();

  // Function called when the user manually refreshes the list
  const onRefresh = useCallback(async () => {
    await refreshPosts();
  }, [refreshPosts]);

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
  // --- Children components
  // -------------------------------------------------------------------------------------

  const renderPosts = React.useCallback(
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
            handlePressDetails(item);
          }}
          onPressComment={() => {
            handlePressComments(item);
          }}
          onPressTip={() => {
            handlePressTip(item);
          }}
          onPressFollow={() => handlePressFollow(item.author)}
          onPressReport={() => {
            handlePressReport(item);
          }}
          onPressHide={() => {
            handlePressHidePost(item.id);
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

  const emptyComponent = useCallback(() => {
    return <EmptyPostComponent textLabel={emptyListText} buttonLabel={emptyListButtonText} />;
  }, [emptyListButtonText, emptyListText]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  if (isLoading) {
    return (
      <View style={styles.contentContainer}>
        <StyledSpinner />
      </View>
    );
  }

  return (
    <View style={styles.contentContainer}>
      <FlashList
        keyExtractor={(item, index) => `${index}item+${item.id}`}
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
        renderItem={renderPosts}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={emptyComponent}
        estimatedItemSize={180}
        ItemSeparatorComponent={HomeItemSeparatorComponent}
        onEndReached={fetchMore}
        getItemType={getPostType}
      />
    </View>
  );
};

export default UserPostsList;
