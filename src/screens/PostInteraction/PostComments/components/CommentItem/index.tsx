import {loadingOrange} from 'assets/animations';
import {
  commentIcon,
  commentIconCommented,
  commentLiked,
  commentLikeEmptyIcon,
  commentMore,
  defaultProfilePic,
  tipIcon,
  tipIconTipped,
} from 'assets/images';
import ImageButton from 'components/ImageButton';
import ThemedLottieView from 'components/ThemedLottieView';
import Typography from 'components/Typography';
import useRenderMediaAttachment from 'hooks/rendering/useRenderMediaAttachment';
import useFormatTimeForPostDetails from 'hooks/useFormatTimeForPostDetails';
import {formatNumShorthand} from 'lib/FormatUtils';
import React, {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {
  GestureResponderEvent,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import useStyles from './useStyles';

// note: props are not final
interface Props extends PostItem {
  disableInnerComment?: boolean;

  handlePressMore: (event: GestureResponderEvent) => void;

  handlePressComment: () => void;

  handlePressLike: () => void;

  handlePressTip: () => void;

  handlePress?: () => void;

  handleProfilePicPress?: () => void;

  handleLongPress?: (event: GestureResponderEvent) => void;

  repliesCounter: number;

  // not final
  reactions: {}[];

  tips: {}[];

  creation_date: string;

  liked?: boolean;

  tipped?: boolean;

  commented?: boolean;
}

const CommentItem = ({
  disableInnerComment,
  handlePressComment,
  handlePressLike,
  handlePressMore,
  handlePressTip,
  handlePress,
  handleLongPress,
  handleProfilePicPress,
  author,
  reactions,
  tips,
  creation_date,
  text,
  attachments,
  liked,
  tipped,
  commented,
  repliesCounter,
  isPending,
}: Props) => {
  const styles = useStyles(disableInnerComment);
  const {t} = useTranslation();

  const formattedDate = useFormatTimeForPostDetails(creation_date);

  const {MediaAttachment} = useRenderMediaAttachment({
    attachments,
    imageStyle: {
      marginTop: 8,
      width: '100%',
      height: 150,
      borderRadius: 24,
      resizeMode: 'contain',
    },
    resizeMode: 'cover',
  });

  return (
    <View style={[styles.container, styles.flexRow]}>
      <TouchableOpacity onPress={handleProfilePicPress}>
        <FastImage
          source={
            author?.profile_pic ? {uri: author.profile_pic} : defaultProfilePic
          }
          style={styles.avatar}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handlePress}
        onLongPress={handleLongPress}
        activeOpacity={handlePress ? 0.8 : 1}
        style={styles.flex}>
        <View style={styles.contentContainer}>
          <TouchableOpacity
            style={styles.flexRow}
            onPress={handleProfilePicPress}>
            <View>
              <Typography.Subtitle3 style={styles.textStyle}>
                {author?.nickname ? author.nickname : t('no nickname')}
              </Typography.Subtitle3>
              <Typography.Body7 style={styles.subTextStyle}>
                @{author?.dtag}
              </Typography.Body7>
            </View>
          </TouchableOpacity>

          {isPending ? (
            <ThemedLottieView
              loop
              autoPlay
              source={loadingOrange}
              style={styles.loadingAnim}
            />
          ) : (
            <ImageButton
              onPress={handlePressMore}
              image={commentMore}
              style={styles.buttonImage}
            />
          )}
        </View>
        {MediaAttachment}
        <Typography.Body6 style={styles.contentText}>{text}</Typography.Body6>
        <View style={styles.bottomGroup}>
          <View>
            <Typography.Body7 style={styles.subTextStyle}>
              {isPending ? t('common:broadcasting') : formattedDate}
            </Typography.Body7>
          </View>

          <View style={styles.interactionButtonGroup}>
            {!disableInnerComment && (
              <TouchableOpacity
                onPress={handlePressComment}
                style={styles.interactionButton}>
                <Image
                  source={commented ? commentIconCommented : commentIcon}
                  style={[
                    styles.buttonImage,
                    styles.interactionImage,
                    commented ? styles.orangeIconAndText : {},
                  ]}
                />
                <Typography.Subtitle3
                  style={
                    commented ? styles.orangeIconAndText : styles.textStyle
                  }>
                  {formatNumShorthand(repliesCounter)}
                </Typography.Subtitle3>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handlePressLike}
              style={styles.interactionButton}>
              <Image
                source={liked ? commentLiked : commentLikeEmptyIcon}
                style={[
                  styles.buttonImage,
                  liked ? styles.orangeIconAndText : {},
                  styles.interactionImage,
                ]}
              />
              <Typography.Subtitle3
                style={liked ? styles.orangeIconAndText : styles.textStyle}>
                {reactions ? formatNumShorthand(reactions.length) : 0}
              </Typography.Subtitle3>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePressTip}
              style={styles.interactionButton}>
              <Image
                source={tipped ? tipIconTipped : tipIcon}
                style={[
                  styles.buttonImage,
                  styles.interactionImage,
                  tipped && styles.orangeIconAndText,
                ]}
              />
              <Typography.Subtitle3
                style={tipped ? styles.orangeIconAndText : styles.textStyle}>
                {tips ? formatNumShorthand(tips.length) : 0}
              </Typography.Subtitle3>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default memo(CommentItem);
