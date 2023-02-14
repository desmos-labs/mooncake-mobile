import { loadingOrange } from 'assets/animations';
import {
  commentIcon,
  commentLiked,
  commentLikeEmptyIcon,
  commentMore,
  tipIcon,
} from 'assets/images';
import ImageButton from 'components/ImageButton';
import ThemedLottieView from 'components/ThemedLottieView';
import Typography from 'components/Typography';
import useRenderMediaAttachment from 'hooks/rendering/useRenderMediaAttachment';
import useFormatTimeForPostDetails from 'hooks/useFormatTimeForPostDetails';
import { formatNumShorthand } from 'lib/FormatUtils';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { GestureResponderEvent, Image, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { isPostPending, Post } from 'types/posts';
import { getProfilePicture } from 'lib/ProfileUtils';
import useGetPostReactionsCount from 'hooks/useGetPostReactionsCount';
import useGetPostTipsCount from 'hooks/useGetPostTipsCount';
import useGetPostCommentsCount from 'hooks/useGetPostCommentsCount';
import useHasReacted from 'hooks/useHasReacted';
import useStyles from './useStyles';

export interface CommentItemProps {
  readonly comment: Post;
  readonly handlePressMore: (event: GestureResponderEvent) => void;
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
    handlePressMore,
    handlePressTip,
    handlePress,
    handleLongPress,
    handleProfilePicPress,
  } = props;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const { count: commentsCount } = useGetPostCommentsCount(comment);
  const hasReacted = useHasReacted(comment);
  const { count: reactionsCount } = useGetPostReactionsCount(comment);
  const { count: tipsCount } = useGetPostTipsCount(comment);

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
            <ImageButton onPress={handlePressMore} image={commentMore} style={styles.buttonImage} />
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
