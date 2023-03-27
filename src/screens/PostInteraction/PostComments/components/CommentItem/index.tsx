import { loadingOrange } from 'assets/animations';
import {
  block,
  commentIcon,
  commentLiked,
  commentLikeEmptyIcon,
  followBlackIcon,
  reportIcon,
  tipIcon,
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
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
import {
  useHandlePressSendTips,
  useHandlePressShowCommentDetails,
} from 'screens/PostDetails/hooks';
import PopupMenu from 'components/PopupMenu';
import useIsFollowing from 'hooks/relationships/useIsFollowing';
import { useHandlePressFollow, useHandlePressReport } from 'screens/Home/hooks';
import useAddOrRemoveLike from 'hooks/reactions/useAddOrRemoveLike';
import useStyles from './useStyles';

export interface CommentItemProps {
  readonly comment: Post;
  readonly disableInnerComment?: boolean;
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

  const { comment, handlePressMore, disableInnerComment } = props;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const { count: commentsCount } = usePostCommentsCount(comment);
  const { count: reactionsCount } = usePostReactionsCount(comment);
  const { count: tipsCount } = usePostTipsCount(comment);
  const handleNavigateToProfile = useNavigateToProfile();
  const handlePressSendTips = useHandlePressSendTips();
  const handleShowCommentDetails = useHandlePressShowCommentDetails();
  const isFollowing = useIsFollowing(comment.author.address);
  const handlePressFollow = useHandlePressFollow();
  const handlePressReport = useHandlePressReport();
  const { liked, addOrRemoveLike } = useAddOrRemoveLike(comment);

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
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

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

  // -------------------------------------------------------------------------------------
  // --- Conditional Rendering
  // -------------------------------------------------------------------------------------

  /**
   * Call handlePressMore if it has been passed as an argument, otherwise open a contextual popup menu where
   * the user can follow or report the comment author.
   */
  const PressMoreComponent = React.useMemo(() => {
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
        label: t('home:block'),
        onPress: () => {
          // TODO: implement
        },
        icon: block,
      },
    ];

    return <PopupMenu menuItems={menuItems} onMenuOpen={handlePressMore} />;
  }, [comment, handlePressFollow, handlePressMore, handlePressReport, isFollowing, t]);

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
            <ThemedLottieView loop autoPlay source={loadingOrange} style={styles.loadingAnim} />
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
              <TouchableOpacity style={styles.interactionButton}>
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
