import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import {
  followBlackIcon,
  moreBlackIcon,
  reportIcon,
  shareBlackIcon,
  unfollowBlackIcon,
} from 'assets/images';
import BackButton from 'components/BackButton';
import DView from 'components/DView';
import EnterCommentBottomBar from 'components/EnterCommentBottomBar';
import ImageButton from 'components/ImageButton';
import PopupMenu from 'components/PopupMenu';
import PostComponent from 'components/PostComponent';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { BottomTabsParamList } from 'navigation/RootNavigator/BottomTabs';
import ROUTES from 'navigation/routes';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Dimensions, View } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { verticalScale } from 'react-native-size-matters';
import InteractionCountersBar from 'screens/PostDetails/components/InteractionCountersBar';
import PostActionButtonsBar from 'screens/PostDetails/components/PostActionButtonsBar';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import ItemSeparatorComponent from 'screens/PostInteraction/components/ItemSeparatorComponent';
import CommentItem from 'screens/PostInteraction/PostComments/components/CommentItem';
import { FlashList } from '@shopify/flash-list';
import { isCommentReply, isPostPending, Post } from 'types/posts';
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
import { DesmosProfile } from 'types/desmos';
import usePost from 'hooks/posts/usePost';
import useHasReacted from 'hooks/reactions/useHasReacted';
import usePostComments from 'hooks/posts/comments/usePostComments';
import { ListRenderItemInfo } from '@shopify/flash-list/src/FlashListProps';
import useFormatTimeForPostDetails from 'hooks/formatting/useFormatTimeForPostDetails';
import useIsFollowing from 'hooks/relationships/useIsFollowing';
import usePostReactionsCount from 'hooks/reactions/usePostReactionsCount';
import usePostCommentsCount from 'hooks/posts/comments/usePostCommentsCount';
import { useActiveAccountAddress } from '@recoil/accounts';
import usePostTipsCount from 'hooks/tips/usePostTipsCount';
import { getProfileDisplayName } from 'lib/ProfileUtils';
import { useActiveProfile } from '@recoil/profiles';
import TopBar from 'components/TopBar';
import usePostInteractionsAuthors from 'hooks/posts/usePostInteractionsAuthors';
import useFocusTextInputOnNavigate from 'hooks/useFocusTextInputOnNavigate';
import {
  useHandleCreateComment,
  useHandleExpandCommentView,
  useHandlePressCounters,
  useHandlePressFollowOrUnfollow,
  useHandlePressReaction,
  useHandlePressReportPost,
  useHandlePressReportUser,
  useHandlePressSendTips,
  useHandlePressShowCommentDetails,
} from './hooks';
import useStyles from './useStyles';

export type NavProps = CompositeScreenProps<
  StackScreenProps<RootNavigatorParamList, ROUTES.POST_DETAILS>,
  BottomTabScreenProps<BottomTabsParamList>
>;

export interface PostDetailsParams {
  /**
   * Subspace ID the post that should be visualized.
   */
  readonly subspaceId: number;

  /**
   * ID of the post that should be visualized.
   */
  readonly postId: number;
  /**
   * focus the comment box when navigating to this screen
   */
  readonly focusCommentBox?: boolean;
  /**
   * ID of the post to be focused within the list of comments.
   * TODO: Implement the scrolling of the list to this post
   */
  readonly focusPostId?: number;
}

const PostDetails = () => {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('postDetails');
  const { goBack } = useNavigation<NavProps['navigation']>();

  const { params } = useRoute<NavProps['route']>();
  const { top } = useSafeAreaInsets();
  const { subspaceId, postId } = params;
  const postData = { subspaceId, id: postId } as Pick<Post, 'subspaceId' | 'id'>;

  // -------------------------------------------------------------------------------------
  // --- Menus
  // -------------------------------------------------------------------------------------

  const [menuVisible, setMenuVisible] = useState(false);

  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<{
    x: number;
    y: number;
  }>();

  const [anchor, setAnchor] = useState<{ x: number; y: number }>();
  const [popupMenuParams, setPopupMenuParams] = useState<{
    post: Post;
    user: DesmosProfile;
  }>();

  // -------------------------------------------------------------------------------------
  // --- Views references
  // -------------------------------------------------------------------------------------

  const scrollViewRef = useRef<any>(null);
  const { textInputRef, focusTextInputRef } = useFocusTextInputOnNavigate();

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const formatDate = useFormatTimeForPostDetails();
  const activeAddress = useActiveAccountAddress();
  const activeProfile = useActiveProfile();

  // Post data
  const { post, loading: isPostLoading, refetch: refreshPost } = usePost(subspaceId, postId);

  // Reactions data
  const {
    count: reactionsCount,
    loading: isReactionsCountLoading,
    refetch: refreshReactionsCount,
  } = usePostReactionsCount(postData);
  const hasReacted = useHasReacted(postData);

  // Comments data
  const {
    comments,
    loading: areCommentsLoading,
    refetch: refreshComments,
    fetchMore: fetchMoreComments,
  } = usePostComments(postData);
  const { count: commentsCount, refetch: refreshCommentsCount } = usePostCommentsCount(postData);

  // Tips data
  const {
    count: tipsCount,
    loading: isTipsCountLoading,
    refetch: refreshTipsCount,
  } = usePostTipsCount(postData);

  // Interactions data
  const {
    authors: interactionsAuthors,
    loading: areInteractionsAuthorsLoading,
    refetch: refreshInteractionsAuthors,
  } = usePostInteractionsAuthors(postData, 3);

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const handlePressReportUser = useHandlePressReportUser();
  const handlePressFollowOrUnfollow = useHandlePressFollowOrUnfollow();

  const handlePressCounters = useHandlePressCounters(postData);
  const { handleCreateComment } = useHandleCreateComment();

  const handleExpandCommentView = useHandleExpandCommentView();
  const handlePressReaction = useHandlePressReaction();
  const handlePressSendTips = useHandlePressSendTips();
  const handlePressReportPost = useHandlePressReportPost();
  const handleShowCommentDetails = useHandlePressShowCommentDetails();
  const handleNavigateToProfile = useNavigateToProfile();

  // Method used to refresh the post data
  const refreshPage = useCallback(() => {
    refreshPost();
    refreshReactionsCount();
    refreshComments();
    refreshCommentsCount();
    refreshTipsCount();
    refreshInteractionsAuthors();
  }, [
    refreshComments,
    refreshCommentsCount,
    refreshInteractionsAuthors,
    refreshPost,
    refreshReactionsCount,
    refreshTipsCount,
  ]);

  // -------------------------------------------------------------------------------------
  // --- Formatted data
  // -------------------------------------------------------------------------------------

  const isFollowingAddress = useIsFollowing(popupMenuParams?.user?.address ?? '');

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  useFocusEffect(
    useCallback(() => {
      // Clean the popup params
      setPopupMenuParams(undefined);

      // Refresh the data
      refreshPage();
    }, []),
  );

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  // Function uses to render the items inside the list of comments
  const renderItem = React.useCallback(
    (info: ListRenderItemInfo<Post>) => {
      const { item } = info;
      return (
        <CommentItem
          comment={item}
          handlePressMore={event => {
            if (isPostPending(item)) return;
            setAnchor({
              x: event.nativeEvent.pageX,
              y: event.nativeEvent.pageY,
            });
            setMenuVisible(true);
            setPopupMenuParams({
              post: item,
              user: item.author,
            });
          }}
          handlePressComment={() => {
            handleExpandCommentView(item);
          }}
          handleProfilePicPress={() => {
            handleNavigateToProfile(item.author.address);
          }}
          handlePressLike={() => {
            if (isPostPending(item)) return;
            handlePressReaction(item);
          }}
          handlePressTip={() => {
            if (isPostPending(item)) return;
            handlePressSendTips(item);
          }}
          handlePress={() => {
            if (isPostPending(item)) return;
            handleShowCommentDetails(item);
          }}
        />
      );
    },
    [
      handleExpandCommentView,
      handleNavigateToProfile,
      handlePressReaction,
      handlePressSendTips,
      handleShowCommentDetails,
    ],
  );

  // TODO: Move this in a custom component
  const ListEmptyComponent = React.useMemo(() => {
    return <EmptyListComponent label="No comments yet" />;
  }, []);

  // TODO: Move this in a custom component
  const HeaderComponent = useMemo(
    () => (
      <>
        <PostComponent post={post!} />
        <PostActionButtonsBar
          postLiked={hasReacted}
          handleLikePress={() => handlePressReaction(post!)}
          handleCommentPress={focusTextInputRef}
          handleTipPress={() => handlePressSendTips(post!)}
        />
        <Spacer paddingVertical={16}>
          <InteractionCountersBar
            loading={isReactionsCountLoading || isTipsCountLoading || areInteractionsAuthorsLoading}
            likesCounter={reactionsCount}
            tipsCounter={tipsCount}
            handlePressCounters={handlePressCounters}
            interactionAuthors={interactionsAuthors}
          />
        </Spacer>
        <Divider style={styles.divider} />
        <Spacer paddingBottom={16} />
      </>
    ),
    [
      post,
      hasReacted,
      focusTextInputRef,
      isReactionsCountLoading,
      isTipsCountLoading,
      areInteractionsAuthorsLoading,
      reactionsCount,
      tipsCount,
      handlePressCounters,
      interactionsAuthors,
      styles.divider,
      handlePressReaction,
      handlePressSendTips,
    ],
  );

  // TODO: Move this in a custom component
  const CustomTopBar = React.useMemo(() => {
    if (isCommentReply(post!)) {
      return (
        <TopBar
          style={styles.topBar}
          centerElement={
            <View style={styles.rightContainer}>
              <Typography.Subtitle3 numberOfLines={1}>
                {commentsCount} {t('replies')}
              </Typography.Subtitle3>
            </View>
          }
        />
      );
    }

    // Custom top bar for comments
    return (
      <View style={styles.customTopBarContainer}>
        <View style={styles.customTopBarInnerContainer}>
          <BackButton onPress={goBack} />

          <Spacer paddingLeft={theme.spacing.m}>
            <View style={styles.rightContainer}>
              <ProfileHeaderButton
                profile={post!.author}
                onPress={() => handleNavigateToProfile(post!.author.address)}
              />
              <View style={styles.middleTextContainer}>
                <Typography.Subtitle3 numberOfLines={1}>
                  {getProfileDisplayName(post!.author)}
                </Typography.Subtitle3>
                <Typography.Body7>{formatDate(post!.creationDate)}</Typography.Body7>
              </View>
            </View>
          </Spacer>
        </View>

        <View style={styles.rightContainer}>
          {activeAddress !== post!.author.address && (
            <ImageButton
              style={[styles.followIcon]}
              image={isFollowingAddress ? unfollowBlackIcon : followBlackIcon}
              onPress={() => {
                handlePressFollowOrUnfollow(post!.author);
              }}
            />
          )}
          <ImageButton
            onPress={() => {
              setProfileMenuAnchor({
                x: Dimensions.get('window').width * 0.95,
                y: verticalScale(35) + top,
              });
              setProfileMenuVisible(true);
            }}
            style={styles.moreIcon}
            image={moreBlackIcon}
          />
        </View>
      </View>
    );
  }, [
    post,
    styles.customTopBarContainer,
    styles.customTopBarInnerContainer,
    styles.rightContainer,
    styles.middleTextContainer,
    styles.followIcon,
    styles.moreIcon,
    styles.topBar,
    goBack,
    theme.spacing.m,
    formatDate,
    activeAddress,
    isFollowingAddress,
    commentsCount,
    t,
    handleNavigateToProfile,
    handlePressFollowOrUnfollow,
    top,
  ]);

  // -------------------------------------------------------------------------------------
  // --- Conditional rendering
  // -------------------------------------------------------------------------------------

  if (!post) {
    // If the post is loading, show the loading screen
    if (isPostLoading) {
      // TODO: Improve this in order to show the proper loading screen
      return <ActivityIndicator />;
    }

    // TODO: It's best to show an error here or something, as it means the post does not exist anymore
    goBack();
    return null;
  }

  // -------------------------------------------------------------------------------------
  // --- Rendering
  // -------------------------------------------------------------------------------------

  return (
    <DView
      disableHideKeyboardTouchable={true}
      backgroundColor={theme.colors.white}
      edges={['top']}
      style={styles.root}
      topBar={CustomTopBar}>
      {/* List of comments */}
      <FlashList
        estimatedItemSize={160}
        ref={scrollViewRef}
        scrollEnabled={true}
        refreshing={isPostLoading}
        onRefresh={refreshPage}
        ListHeaderComponent={HeaderComponent}
        ItemSeparatorComponent={ItemSeparatorComponent}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContainer}
        data={comments}
        ListEmptyComponent={ListEmptyComponent}
        keyboardDismissMode="on-drag"
        onEndReached={fetchMoreComments}
      />

      {/* Bottom bar allowing to create a new comment */}
      <EnterCommentBottomBar
        author={activeProfile}
        loading={areCommentsLoading}
        handlePostComment={() => handleCreateComment(post)}
        textInputRef={textInputRef}
        onIconPress={() => handleExpandCommentView(post)}
      />

      {/* Menu used to perform author-related operations */}
      <PopupMenu
        anchor={anchor}
        visible={menuVisible}
        closeMenu={() => setMenuVisible(false)}
        menuItems={[
          {
            icon: isFollowingAddress ? unfollowBlackIcon : followBlackIcon,
            label: isFollowingAddress ? t('unfollow') : t('follow'),
            onPress: () => {
              handlePressFollowOrUnfollow(popupMenuParams!.user);
            },
          },
          {
            icon: reportIcon,
            label: t('report'),
            onPress: () => {
              handlePressReportUser(popupMenuParams!.user);
            },
          },
        ]}
      />

      {/* Menu used to perform post-related operations */}
      <PopupMenu
        anchor={profileMenuAnchor}
        visible={profileMenuVisible}
        closeMenu={() => setProfileMenuVisible(false)}
        menuItems={[
          {
            icon: shareBlackIcon,
            label: t('share'),
            onPress: () => console.log('share'),
          },
          {
            icon: reportIcon,
            label: t('report'),
            onPress: () => {
              handlePressReportPost(popupMenuParams!.post);
            },
          },
        ]}
      />
    </DView>
  );
};

export default PostDetails;
