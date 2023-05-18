import { loadingYellow } from 'assets/animations';
import {
  block,
  commentIcon,
  commentLiked,
  commentLikeEmptyIcon,
  followBlackIcon,
  hidePost,
  reportIcon,
  tipIcon,
  unblock,
  unfollowBlackIcon,
} from 'assets/images';
import ThemedLottieView from 'components/ThemedLottieView';
import Typography from 'components/Typography';
import useRenderMediaAttachment from 'hooks/rendering/useRenderMediaAttachment';
import useFormatTimeForPostDetails from 'hooks/formatting/useFormatTimeForPostDetails';
import { formatNumShorthand } from 'lib/FormatUtils';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { isPostPending, Post } from 'types/posts';
import { getProfilePicture } from 'lib/ProfileUtils';
import usePostReactionsCount from 'hooks/reactions/usePostReactionsCount';
import usePostTipsCount from 'hooks/tips/usePostTipsCount';
import usePostCommentsCount from 'hooks/posts/comments/usePostCommentsCount';
import PopupMenu from 'components/PopupMenu';
import useIsFollowing from 'hooks/relationships/useIsFollowing';
import {
  useHandlePressBlock,
  useHandlePressFollow,
  useHandlePressHidePost,
  useHandlePressReport,
} from 'screens/Home/hooks';
import useAddOrRemoveLike from 'hooks/reactions/useAddOrRemoveLike';
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
import {
  useHandlePressSendTips,
  useHandlePressShowCommentDetails,
  useHandlePressShowCommentDetailsWithFocus,
  useReturnToRootPost,
} from 'screens/PostDetails/hooks';
import { useActiveAccountAddress } from '@recoil/accounts';
import useIsBlocked from 'hooks/relationships/blocked/useIsBlocked';
import useIsAuthorActiveUser from 'hooks/useIsAuthorActiveUser';
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
  const { count: reactionsCount } = usePostReactionsCount(comment);
  const { count: tipsCount } = usePostTipsCount(comment);
  const { isFollowing } = useIsFollowing(comment.author.address);
  const { isBlocked } = useIsBlocked(comment.author.address);
  const { liked, addOrRemoveLike } = useAddOrRemoveLike(comment);
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
  const handlePressSendTips = useHandlePressSendTips();
  const handleShowCommentDetails = useHandlePressShowCommentDetails();
  const handleShowCommentDetailsWithFocus = useHandlePressShowCommentDetailsWithFocus();
  const handlePressFollow = useHandlePressFollow();
  const handlePressReport = useHandlePressReport();
  const handleHidePost = useHandlePressHidePost();
  const returnToRootPost = useReturnToRootPost();
  const handlePressBlock = useHandlePressBlock();

  const handlePressLike = () => {
    if (isPostPending(comment)) return;
    addOrRemoveLike(comment);
  };
  const handlePressTip = () => {
    if (isPostPending(comment)) return;
    handlePressSendTips(comment);
  };
  const handlePress = () => {
    if (isPostPending(comment)) return;
    handleShowCommentDetails(comment);
  };
  const handlePressCommentWithFocus = () => {
    if (isPostPending(comment)) return;
    handleShowCommentDetailsWithFocus(comment);
  };
  const handlePressHidePost = async () => {
    if (isPostPending(comment)) return;
    // Return to the main post first, so the usePostComments hook can catch the modified
    // localHiddenPosts state.
    if (renderedAsMainPost) {
      returnToRootPost();
    }
    await handleHidePost(comment.id);
  };

  // -------------------------------------------------------------------------------------
  // --- Conditional Rendering
  // -------------------------------------------------------------------------------------

  /**
   * Call handlePressMore if it has been passed as an argument, otherwise open a contextual popup menu where
   * the user can follow or report the comment author.
   */
  const PressMoreComponent = React.useMemo(() => {
    // The context menu should not be visible if the user is the author of the comment
    if (isAuthorActiveUser) return undefined;

    const menuItems = [
      {
        label: isFollowing ? t('home:unfollow') : t('home:follow'),
        onPress: () => handlePressFollow(comment.author),
        icon: isFollowing ? unfollowBlackIcon : followBlackIcon,
      },
      {
        label: t('home:report'),
        onPress: () => handlePressReport(comment),
        icon: reportIcon,
      },
      {
        label: t('home:hide'),
        onPress: () => handlePressHidePost(),
        icon: hidePost,
      },
      {
        label: isBlocked ? t('home:unblock') : t('home:block'),
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
    returnToRootPost,
    t,
    handlePressBlock,
    isBlocked,
  ]);

  return (
    <View style={[styles.container, styles.flexRow]}>
      <TouchableOpacity onPress={() => handleNavigateToProfile(comment.author.address)}>
        <FastImage source={getProfilePicture(comment.author)} style={styles.avatar} />
      </TouchableOpacity>

      <TouchableOpacity onPress={handlePress} style={styles.flex}>
        <View style={styles.contentContainer}>
          <TouchableOpacity
            style={styles.flexRow}
            onPress={() => handleNavigateToProfile(comment.author.address)}>
            <View>
              <Typography.Subtitle3 style={styles.textStyle}>
                {comment.author.nickname ? comment.author.nickname : t('no nickname')}
              </Typography.Subtitle3>
              <Typography.Body7 style={styles.subTextStyle}>
                @{comment.author.dTag}
              </Typography.Body7>
            </View>
          </TouchableOpacity>

          {isPostPending(comment) ? (
            <ThemedLottieView loop autoPlay source={loadingYellow} style={styles.loadingAnim} />
          ) : (
            PressMoreComponent
          )}
        </View>
        {MediaAttachment}
        <Typography.Body6 style={styles.contentText}>{comment.text}</Typography.Body6>
        <View style={styles.bottomGroup}>
          <View>
            <Typography.Body7 style={styles.subTextStyle}>
              {isPostPending(comment) ? t('common:broadcasting') : formattedDate}
            </Typography.Body7>
          </View>

          <View style={styles.interactionButtonGroup}>
            {!disableInnerComment && (
              <TouchableOpacity
                onPress={handlePressCommentWithFocus}
                style={styles.interactionButton}>
                <Image source={commentIcon} style={[styles.buttonImage, styles.interactionImage]} />
                <Typography.Subtitle3 style={styles.textStyle}>
                  {formatNumShorthand(commentsCount)}
                </Typography.Subtitle3>
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
              <Typography.Subtitle3 style={liked ? styles.orangeIconAndText : styles.textStyle}>
                {formatNumShorthand(reactionsCount)}
              </Typography.Subtitle3>
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePressTip} style={styles.interactionButton}>
              <Image source={tipIcon} style={[styles.buttonImage, styles.interactionImage]} />
              <Typography.Subtitle3 style={styles.textStyle}>
                {formatNumShorthand(tipsCount)}
              </Typography.Subtitle3>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default memo(CommentItem);
