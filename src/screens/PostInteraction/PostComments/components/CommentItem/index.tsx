import { loadingOrange } from 'assets/animations';
import {
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
import { GestureResponderEvent, Image, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { isPostPending, Post } from 'types/posts';
import { getProfilePicture } from 'lib/ProfileUtils';
import usePostReactionsCount from 'hooks/reactions/usePostReactionsCount';
import usePostTipsCount from 'hooks/tips/usePostTipsCount';
import usePostCommentsCount from 'hooks/posts/comments/usePostCommentsCount';
import useHasReacted from 'hooks/reactions/useHasReacted';
import PopupMenu from 'components/PopupMenu';
import useIsFollowing from 'hooks/relationships/useIsFollowing';
import { useHandlePressFollow, useHandlePressReport } from 'screens/Home/hooks';
import useStyles from './useStyles';

export interface CommentItemProps {
  readonly comment: Post;
  readonly handlePressComment: () => void;
  readonly handlePressLike: () => void;
  readonly handlePressTip: () => void;
  readonly handlePress?: () => void;
  readonly handleProfilePicPress?: () => void;
  readonly handleLongPress?: (event: GestureResponderEvent) => void;
  readonly disableInnerComment?: boolean;
}

/**
 * Component that allows to display a single comment inside the list.
 * @constructor
 */
const CommentItem = (props: CommentItemProps) => {
  const styles = useStyles(props);
  const { t } = useTranslation();

  const {
    comment,
    disableInnerComment,
    handlePressComment,
    handlePressLike,
    handlePressTip,
    handlePress,
    handleLongPress,
    handleProfilePicPress,
  } = props;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const { count: commentsCount } = usePostCommentsCount(comment);
  const hasReacted = useHasReacted(comment);
  const { count: reactionsCount } = usePostReactionsCount(comment);
  const { count: tipsCount } = usePostTipsCount(comment);

  // -------------------------------------------------------------------------------------
  // --- Formatted data
  // -------------------------------------------------------------------------------------

  const formattedDate = useFormatTimeForPostDetails(comment.creationDate);

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
  // --- Menu Items
  // -------------------------------------------------------------------------------------

  const isFollowing = useIsFollowing(comment.author.address);
  const handlePressFollow = useHandlePressFollow();
  const handlePressReport = useHandlePressReport();

  const menuItems = React.useMemo(
    () => [
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
    ],
    [handlePressFollow, handlePressReport, isFollowing],
  );

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <View style={[styles.container, styles.flexRow]}>
      <TouchableOpacity onPress={handleProfilePicPress}>
        <FastImage source={getProfilePicture(comment.author)} style={styles.avatar} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handlePress}
        onLongPress={handleLongPress}
        activeOpacity={handlePress ? 0.8 : 1}
        style={styles.flex}>
        <View style={styles.contentContainer}>
          <TouchableOpacity style={styles.flexRow} onPress={handleProfilePicPress}>
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
            <PopupMenu menuItems={menuItems} />
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
              <TouchableOpacity onPress={handlePressComment} style={styles.interactionButton}>
                <Image source={commentIcon} style={[styles.buttonImage, styles.interactionImage]} />
                <Typography.Subtitle3 style={styles.textStyle}>
                  {formatNumShorthand(commentsCount)}
                </Typography.Subtitle3>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handlePressLike} style={styles.interactionButton}>
              <Image
                source={hasReacted ? commentLiked : commentLikeEmptyIcon}
                style={[
                  styles.buttonImage,
                  hasReacted ? styles.orangeIconAndText : {},
                  styles.interactionImage,
                ]}
              />
              <Typography.Subtitle3
                style={hasReacted ? styles.orangeIconAndText : styles.textStyle}>
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
