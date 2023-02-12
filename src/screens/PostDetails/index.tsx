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
import { Dimensions, View } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { verticalScale } from 'react-native-size-matters';
import InteractionCountersBar from 'screens/PostDetails/components/InteractionCountersBar';
import PostActionButtonsBar from 'screens/PostDetails/components/PostActionButtonsBar';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import ItemSeparatorComponent from 'screens/PostInteraction/components/ItemSeparatorComponent';
import CommentItem from 'screens/PostInteraction/PostComments/components/CommentItem';
import { FlashList } from '@shopify/flash-list';
import useFocusTextInputOnNavigate from 'hooks/useFocusOnTextInputWithParams';
import { isCommentReply, isPostPending, Post } from 'types/posts';
import useNavigateToProfile from 'hooks/useNavigateToProfile';
import { DesmosProfile } from 'types/desmos';
import useGetPost from 'hooks/useGetPost';
import useHasReacted from 'hooks/useHasReacted';
import useGetPostComments from 'hooks/useGetPostComments';
import { ListRenderItemInfo } from '@shopify/flash-list/src/FlashListProps';
import useFormatTimeForPostDetails from 'hooks/useFormatTimeForPostDetails';
import useIsFollowing from 'hooks/useIsFollowing';
import useGetPostReactionsCount from 'hooks/useGetPostReactionsCount';
import useGetPostCommentsCount from 'hooks/useGetPostCommentsCount';
import { useActiveAccountAddress } from '@recoil/accounts';
import useGetPostTipsCount from 'hooks/useGetPostTipsCount';
import { getProfileDisplayName } from 'lib/ProfileUtils';
import { useActiveProfile } from '@recoil/profiles';
import TopBar from 'components/TopBar';
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
  useReactorsAndTippersProfilePics,
} from './hooks';
import useStyles from './useStyles';

export type NavProps = CompositeScreenProps<
  StackScreenProps<RootNavigatorParamList, ROUTES.POST_DETAILS>,
  BottomTabScreenProps<BottomTabsParamList>
>;

export interface PostDetailsParams {
  /**
   * Post that should be visualized.
   */
  readonly post: Post;
  /**
   * focus the comment box when navigating to this screen
   */
  readonly focusCommentBox?: boolean;
}

const PostDetails = () => {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('postDetails');
  const { goBack } = useNavigation<NavProps['navigation']>();

  const { params } = useRoute<NavProps['route']>();
  const { top } = useSafeAreaInsets();
  const { post: givenPost } = params;

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
  // --- Data hooks
  // -------------------------------------------------------------------------------------
  const activeAddress = useActiveAccountAddress();
  const activeProfile = useActiveProfile();

  const {
    post: storedPost,
    loading: refreshingPost,
    refetch: refreshPost,
  } = useGetPost(givenPost.subspaceId, givenPost.id);

  // Get the post data based on the given post and the post from the chain
  const post = useMemo(() => storedPost ?? givenPost, [givenPost, storedPost]);

  const {
    profilePics: reactorsAndTippersProfilesPic,
    refetch: refreshReactorsAndTippersProfilesPic,
  } = useReactorsAndTippersProfilePics(post);

  // Reactions data
  const {
    count: reactionsCount,
    loading: isReactionsCountLoading,
    refetch: refreshReactionsCount,
  } = useGetPostReactionsCount(post);
  const hasReacted = useHasReacted(post);

  // Comments data
  const {
    comments,
    loading: areCommentsLoading,
    refetch: refreshComments,
    fetchMore: fetchMoreComments,
  } = useGetPostComments(post);
  const { count: commentsCount, refetch: refreshCommentsCount } = useGetPostCommentsCount(post);

  // Tips data
  const {
    count: tipsCount,
    loading: isTipsCountLoading,
    refetch: refreshTipsCount,
  } = useGetPostTipsCount(post);

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const handlePressReportUser = useHandlePressReportUser();
  const handlePressFollowOrUnfollow = useHandlePressFollowOrUnfollow();

  const handlePressCounters = useHandlePressCounters(post);
  const { loading: creatingComment, handleCreateComment } = useHandleCreateComment(post);

  const handleExpandCommentView = useHandleExpandCommentView();
  const handlePressReaction = useHandlePressReaction();
  const handlePressSendTips = useHandlePressSendTips();
  const handlePressReportPost = useHandlePressReportPost();
  const handleShowCommentDetails = useHandlePressShowCommentDetails();
  const handleNavigateToProfile = useNavigateToProfile();

  // Method used to refresh the post data
  const refreshPage = useCallback(() => {
    refreshPost();
    refreshReactorsAndTippersProfilesPic();
    refreshReactionsCount();
    refreshComments();
    refreshCommentsCount();
    refreshTipsCount();
  }, [
    refreshComments,
    refreshCommentsCount,
    refreshPost,
    refreshReactionsCount,
    refreshReactorsAndTippersProfilesPic,
    refreshTipsCount,
  ]);

  // -------------------------------------------------------------------------------------
  // --- Formatted data
  // -------------------------------------------------------------------------------------

  const formattedDate = useFormatTimeForPostDetails(post.creationDate);
  const isFollowingAddress = useIsFollowing(popupMenuParams?.user?.address ?? '');

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
              post,
              user: post.author,
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
      post,
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
        <PostComponent post={post} />
        <PostActionButtonsBar
          postLiked={hasReacted}
          handleLikePress={() => handlePressReaction(post)}
          handleCommentPress={focusTextInputRef}
          handleTipPress={() => handlePressSendTips(post)}
        />
        <Spacer paddingVertical={16}>
          <InteractionCountersBar
            loading={isReactionsCountLoading || isTipsCountLoading}
            likesCounter={reactionsCount}
            tipsCounter={tipsCount}
            handlePressCounters={handlePressCounters}
            accountsHighlightedPics={reactorsAndTippersProfilesPic}
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
      reactionsCount,
      tipsCount,
      handlePressCounters,
      reactorsAndTippersProfilesPic,
      styles.divider,
      handlePressReaction,
      handlePressSendTips,
    ],
  );

  // TODO: Move this in a custom component
  const CustomTopBar = React.useMemo(() => {
    if (isCommentReply(post)) {
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
                profile={post.author}
                onPress={() => handleNavigateToProfile(post.author.address)}
              />
              <View style={styles.middleTextContainer}>
                <Typography.Subtitle3 numberOfLines={1}>
                  {getProfileDisplayName(post.author)}
                </Typography.Subtitle3>
                <Typography.Body7>{formattedDate}</Typography.Body7>
              </View>
            </View>
          </Spacer>
        </View>

        <View style={styles.rightContainer}>
          {activeAddress !== post.author.address && (
            <ImageButton
              style={[styles.followIcon]}
              image={isFollowingAddress ? unfollowBlackIcon : followBlackIcon}
              onPress={() => {
                handlePressFollowOrUnfollow(post.author);
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
    formattedDate,
    activeAddress,
    isFollowingAddress,
    commentsCount,
    t,
    handleNavigateToProfile,
    handlePressFollowOrUnfollow,
    top,
  ]);

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  useFocusEffect(
    React.useCallback(() => {
      // Clean the popup params
      setPopupMenuParams({ post, user: post.author });

      // Refresh the data
      refreshPage();
    }, [post, refreshPage]),
  );

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
        refreshing={refreshingPost}
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
        handlePostComment={handleCreateComment}
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
