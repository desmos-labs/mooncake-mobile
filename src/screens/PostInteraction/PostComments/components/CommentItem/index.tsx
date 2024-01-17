import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { squaresAnimation } from 'assets/animations';
import {
  block,
  commentIcon,
  commentLiked,
  commentLikeEmptyIcon,
  followBlackIcon,
  hidePost,
  reportIcon,
  unblock,
  unfollowBlackIcon,
} from 'assets/images';
import PopupMenu from 'components/PopupMenu';
import {
  useHandlePressBlock,
  useHandlePressFollow,
  useHandlePressHidePost,
  useHandlePressReport,
} from 'components/PostCard/hooks';
import ThemedLottieView from 'components/ThemedLottieView';
import useFormatTimeForPostDetails from 'hooks/formatting/useFormatTimeForPostDetails';
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
import usePostCommentsCount from 'hooks/posts/comments/usePostCommentsCount';
import useAddOrRemoveLike from 'hooks/reactions/useAddOrRemoveLike';
import useIsBlocked from 'hooks/relationships/useIsBlocked';
import useIsFollowing from 'hooks/relationships/useIsFollowing';
import useRenderMediaAttachment from 'hooks/rendering/useRenderMediaAttachment';
import useIsAuthorActiveUser from 'hooks/useIsAuthorActiveUser';
import { formatNumShorthand } from 'lib/FormatUtils';
import { getProfilePicture } from 'lib/ProfileUtils';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity, View } from 'react-native';
import {
  useHandlePressShowCommentDetails,
  useHandlePressShowCommentDetailsWithFocus,
  useReturnToRootPost,
} from 'screens/PostDetails/hooks';
import { isPostPending, Post } from 'types/posts';
import useStyles from './useStyles';

export interface CommentItemProps {
  readonly comment: Post;
  readonly disableInnerComment?: boolean;
  /**
   * Whether the CommentItem is being rendered as the main post (at the top).
   */
  readonly renderedAsMainPost?: boolean;
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

  const { comment, handlePressMore, disableInnerComment, renderedAsMainPost } = props;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const { count: commentsCount } = usePostCommentsCount(comment);
  const { isFollowing } = useIsFollowing(comment.author.address);
  const { isBlocked } = useIsBlocked(comment.author.address);
  const { liked, addOrRemoveLike, likesCount } = useAddOrRemoveLike(comment);
  const isAuthorActiveUser = useIsAuthorActiveUser(comment.author.address);

  // -------------------------------------------------------------------------------------
  // --- Formatted data
  // -------------------------------------------------------------------------------------

  const formatDate = useFormatTimeForPostDetails();
  const formattedDate = formatDate(comment.creationDate);

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  const { MediaAttachment } = useRenderMediaAttachment(comment.attachments, {
    imageStyle: {
      marginTop: 8,
      width: '100%',
      height: 150,
      borderRadius: 24,
      resizeMode: 'contain',
    },
    resizeMode: 'cover',
  });

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const handleNavigateToProfile = useNavigateToProfile();
  const handleShowCommentDetails = useHandlePressShowCommentDetails();
  const handleShowCommentDetailsWithFocus = useHandlePressShowCommentDetailsWithFocus();
  const handlePressFollow = useHandlePressFollow();
  const handlePressReport = useHandlePressReport();
  const handleHidePost = useHandlePressHidePost();
  const returnToRootPost = useReturnToRootPost();
  const handlePressBlock = useHandlePressBlock();

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
    handleHidePost(comment.id);
  }, [comment, handleHidePost, renderedAsMainPost, returnToRootPost]);

  // -------------------------------------------------------------------------------------
  // --- Conditional Rendering
  // -------------------------------------------------------------------------------------

  /**
   * Call handlePressMore if it has been passed as an argument, otherwise open a contextual popup menu where
   * the user can follow or report the comment author.
   */
  const PressMoreComponent = React.useMemo(() => {
    // The context menu should not be visible if the user is the author of the comment
    if (isAuthorActiveUser) {
      return undefined;
    }

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
        label: isBlocked
          ? t('unblock', { ns: 'relationships' })
          : t('block', { ns: 'relationships' }),
        onPress: () => handlePressBlock(comment.author),
        icon: isBlocked ? unblock : block,
      },
    ];

    return <PopupMenu menuItems={menuItems} onMenuOpen={handlePressMore} />;
  }, [
    isAuthorActiveUser,
    comment,
    handlePressFollow,
    handlePressHidePost,
    handlePressMore,
    handlePressReport,
    isFollowing,
    t,
    handlePressBlock,
    isBlocked,
  ]);

  return (
    <View style={[styles.container, styles.flexRow]}>
      <TouchableOpacity onPress={() => handleNavigateToProfile(comment.author.address)}>
        <Image source={getProfilePicture(comment.author)} style={styles.avatar} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handlePress}
        style={styles.flex}
        activeOpacity={renderedAsMainPost ? 1 : 0.2}>
        <View style={styles.contentContainer}>
          <TouchableOpacity
            style={styles.flexRow}
            onPress={() => handleNavigateToProfile(comment.author.address)}>
            <View>
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
            PressMoreComponent
          )}
        </View>
        {MediaAttachment}
        <Typography.Regular14 style={styles.contentText}>{comment.text}</Typography.Regular14>
        <View style={styles.bottomGroup}>
          <View>
            <Typography.Regular12 style={styles.subTextStyle}>
              {isPostPending(comment) ? t('broadcasting', { ns: 'broadcastTx' }) : formattedDate}
            </Typography.Regular12>
          </View>
          <View style={styles.interactionButtonGroup}>
            {!disableInnerComment && (
              <TouchableOpacity
                onPress={handlePressCommentWithFocus}
                style={styles.interactionButton}>
                <Image source={commentIcon} style={[styles.buttonImage, styles.interactionImage]} />
                <Typography.Semibold14 style={styles.textStyle}>
                  {formatNumShorthand(commentsCount)}
                </Typography.Semibold14>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handlePressLike} style={styles.interactionButton}>
              <Image
                source={liked ? commentLiked : commentLikeEmptyIcon}
                style={[
                  styles.buttonImage,
                  liked ? styles.orangeIconAndText : {},
                  styles.interactionImage,
                ]}
              />
              <Typography.Semibold14 style={liked ? styles.orangeIconAndText : styles.textStyle}>
                {formatNumShorthand(likesCount)}
              </Typography.Semibold14>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CommentItem;
