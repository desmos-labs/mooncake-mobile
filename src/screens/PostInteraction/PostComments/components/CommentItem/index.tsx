import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { Entypo } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { usePostCommentsCount } from '@recoil/commentsCount';
import { squaresAnimation } from 'assets/animations';
import {
  block,
  followBlackIcon,
  hidePost,
  postLikedIcon,
  postToCommentIcon,
  postToLikeIcon,
  reportIcon,
  trashIcon,
  unblock,
  unfollowBlackIcon,
} from 'assets/images';
import AvatarImage from 'components/AvatarImage';
import PopupMenu from 'components/PopupMenu';
import {
  useHandlePressBlock,
  useHandlePressFollow,
  useHandlePressHidePost,
  useHandlePressReport,
} from 'components/PostCard/hooks';
import PostData from 'components/PostData';
import ThemedLottieView from 'components/ThemedLottieView';
import { Image } from 'expo-image';
import useTimePassedDate from 'hooks/formatting/useTimePassedDate';
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
import useConfirmDeletePost from 'hooks/posts/useConfirmDeletePost';
import useAddOrRemoveLike from 'hooks/reactions/useAddOrRemoveLike';
import useIsFollowing from 'hooks/relationships/useIsFollowing';
import useIsAuthorActiveUser from 'hooks/useIsAuthorActiveUser';
import { formatNumShorthand } from 'lib/FormatUtils';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  interpolateColor,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  useHandlePressShowCommentDetails,
  useHandlePressShowCommentDetailsWithFocus,
  useReturnToRootPost,
} from 'screens/PostDetails/hooks';
import { isPostPending, Post } from 'types/posts';
import useStyles from './useStyles';

export interface CommentItemProps {
  readonly comment: Post;
  /**
   * Whether the CommentItem is being rendered as a comment to another comment.
   */
  readonly disableInnerComment?: boolean;
  /**
   * Whether the CommentItem is being rendered as the main post (at the top).
   */
  readonly renderedAsMainPost?: boolean;
  /**
   * Whether the comment should be highlighted.
   */
  readonly highlighted?: boolean;

  readonly parentPost?: Post;

  // This callback may not be necessary anymore as native-base menu does not require x,y anchors to be explicitly set
  // for positioning, but it may be useful to keep around in-case we want to do additional actions when opening the popup menu
  readonly handlePressMore?: () => void;
  // old implementation, for reference (marked for deletion)
  // readonly handlePressMore: (event: GestureResponderEvent) => void;
}

/**
 * Component that allows to display a single comment inside the list.
 * @constructor
 */
const CommentItem = (props: CommentItemProps) => {
  const styles = useStyles(props);
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    comment,
    handlePressMore,
    disableInnerComment,
    renderedAsMainPost,
    highlighted,
    parentPost,
  } = props;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const commentsCount = usePostCommentsCount(comment.id);
  const isFollowing = useIsFollowing(comment.author);
  const { liked, addOrRemoveLike, likesCount } = useAddOrRemoveLike(comment);
  const isAuthorActiveUser = useIsAuthorActiveUser(comment.author.address);

  // -------------------------------------------------------------------------------------
  // --- Formatted data
  // -------------------------------------------------------------------------------------

  const timePassedDate = useTimePassedDate(comment.creationDate);

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------
  const [menuOpened, setMenuOpened] = useState(false);
  const handleNavigateToProfile = useNavigateToProfile();
  const handleShowCommentDetails = useHandlePressShowCommentDetails();
  const handleShowCommentDetailsWithFocus = useHandlePressShowCommentDetailsWithFocus();
  const handlePressFollow = useHandlePressFollow();
  const handlePressReport = useHandlePressReport();
  const handleHidePost = useHandlePressHidePost();
  const returnToRootPost = useReturnToRootPost();
  const handlePressBlock = useHandlePressBlock();
  const deletePost = useConfirmDeletePost();

  const openPopupMenu = () => {
    setMenuOpened(true);
    if (handlePressMore) {
      handlePressMore();
    }
  };

  const handlePressLike = () => {
    if (isPostPending(comment)) {
      return;
    }
    addOrRemoveLike(comment);
  };
  const handlePress = () => {
    if (isPostPending(comment)) {
      return;
    }
    if (renderedAsMainPost) {
      return;
    }
    handleShowCommentDetails(comment);
  };
  const handlePressCommentWithFocus = () => {
    if (isPostPending(comment)) {
      return;
    }
    handleShowCommentDetailsWithFocus(comment);
  };
  const handlePressHidePost = useCallback(() => {
    if (isPostPending(comment)) {
      return;
    }
    // Return to the main post first, so the usePostComments hook can catch the modified
    // localHiddenPosts state.
    if (renderedAsMainPost) {
      returnToRootPost();
    }
    handleHidePost(comment);
  }, [comment, handleHidePost, renderedAsMainPost, returnToRootPost]);

  // Animations
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [theme.colors.primaryVariants['100'], theme.colors.white],
      ),
      marginHorizontal: -theme.spacings.m,
      paddingHorizontal: theme.spacings.l,
    };
  });

  useEffect(() => {
    setTimeout(() => {
      progress.value = withTiming(1, { duration: 500 });
    }, 2000);
  }, [progress]);

  // -------------------------------------------------------------------------------------
  // --- Conditional Rendering
  // -------------------------------------------------------------------------------------

  /**
   * Call handlePressMore if it has been passed as an argument, otherwise open a contextual popup menu where
   * the user can follow or report the comment author.
   */
  const PressMoreComponent = React.useMemo(() => {
    // The context menu should not be visible if the user is the author of the comment
    const ownMenuItems = [
      {
        label: t('delete post', { ns: 'createPost' }),
        onPress: () =>
          deletePost({
            post: comment,
            parent: parentPost,
          }),
        icon: trashIcon,
      },
    ];

    const menuItems = [
      {
        label: isFollowing
          ? t('unfollow', { ns: 'relationships' })
          : t('follow', { ns: 'relationships' }),
        onPress: () => handlePressFollow(comment.author),
        icon: isFollowing ? unfollowBlackIcon : followBlackIcon,
      },
      {
        label: t('report', { ns: 'postOperations' }),
        onPress: () => handlePressReport(comment),
        icon: reportIcon,
      },
      {
        label: t('hide', { ns: 'postOperations' }),
        onPress: () => handlePressHidePost(),
        icon: hidePost,
      },
      {
        label: comment.author.isBlockedByUser
          ? t('unblock', { ns: 'relationships' })
          : t('block', { ns: 'relationships' }),
        onPress: () => handlePressBlock(comment.author),
        icon: comment.author.isBlockedByUser ? unblock : block,
      },
    ];

    return (
      <PopupMenu
        menuItems={isAuthorActiveUser ? ownMenuItems : menuItems}
        popupMenuOpened={menuOpened}
        setPopupMenuOpened={setMenuOpened}
      />
    );
  }, [
    t,
    isFollowing,
    comment,
    isAuthorActiveUser,
    menuOpened,
    deletePost,
    parentPost,
    handlePressFollow,
    handlePressReport,
    handlePressHidePost,
    handlePressBlock,
  ]);

  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(250)}
      style={[styles.container, styles.flexRow, highlighted && animatedStyle]}
      layout={LinearTransition.duration(250)}>
      {/* User profile picture */}
      <TouchableOpacity onPress={() => handleNavigateToProfile(comment.author.address)}>
        <AvatarImage imageSource={comment.author} size={40} />
      </TouchableOpacity>

      {/* User nickname */}
      <TouchableOpacity
        onPress={handlePress}
        style={styles.flex}
        activeOpacity={renderedAsMainPost ? 1 : 0.2}>
        <View style={styles.contentContainer}>
          {/* Author nickname or DTag */}
          <TouchableOpacity
            style={styles.flexRow}
            onPress={() => handleNavigateToProfile(comment.author.address)}>
            <View style={styles.authorInfo}>
              <Typography.Semibold14 style={styles.textStyle}>
                {comment.author.nickname ? comment.author.nickname : t('no nickname')}
              </Typography.Semibold14>
              <Typography.Regular12 style={styles.subTextStyle}>
                @{comment.author.dTag}
              </Typography.Regular12>
            </View>
          </TouchableOpacity>
          {isPostPending(comment) ? (
            <ThemedLottieView loop autoPlay source={squaresAnimation} style={styles.loadingAnim} />
          ) : (
            <Entypo
              name="dots-three-horizontal"
              size={24}
              color="black"
              suppressHighlighting
              onPress={openPopupMenu}
            />
          )}
        </View>
        {PressMoreComponent}
        {/* Comment content */}
        <PostData
          post={comment}
          attachmentRenderOptions={{
            media: {
              useAutoSize: true,
              imageStyle: {
                width: '100%',
                marginBottom: 8,
              },
              resizeMode: 'cover',
            },
          }}
        />

        {/* Bottom bar */}
        <View style={styles.bottomGroup}>
          {/* Creation date */}
          <View>
            <Typography.Regular12 style={styles.dateTextStyle}>
              {isPostPending(comment) ? t('broadcasting', { ns: 'broadcastTx' }) : timePassedDate}
            </Typography.Regular12>
          </View>

          {/* Counters */}
          <View style={styles.interactionButtonGroup}>
            {/* Comments count */}
            {!disableInnerComment && (
              <TouchableOpacity
                onPress={handlePressCommentWithFocus}
                style={styles.interactionButton}>
                <Image
                  source={postToCommentIcon}
                  style={[styles.buttonImage, styles.interactionImage]}
                />
                <Typography.Regular16 style={styles.subTextStyle}>
                  {formatNumShorthand(commentsCount)}
                </Typography.Regular16>
              </TouchableOpacity>
            )}

            {/* Likes count */}
            <TouchableOpacity onPress={handlePressLike} style={styles.interactionButton}>
              <Image
                source={liked ? postLikedIcon : postToLikeIcon}
                style={[
                  styles.buttonImage,
                  liked ? styles.orangeIcon : {},
                  styles.interactionImage,
                ]}
              />
              <Typography.Regular16 style={liked ? styles.orangeText : styles.subTextStyle}>
                {formatNumShorthand(likesCount)}
              </Typography.Regular16>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CommentItem;
