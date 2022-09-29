import {buildingBlockAnim} from 'assets/animations';
import {
  commentComment,
  commentLiked,
  commentMore,
  commentTip,
  defaultProfilePic,
  optionsIcon,
} from 'assets/images';
import ImageButton from 'components/ImageButton';
import ThemedLottieView from 'components/ThemedLottieView';
import Typography from 'components/Typography';
import useRenderMediaAttachment from 'hooks/rendering/useRenderMediaAttachment';
import useFormatTimeForPostDetails from 'hooks/useFormatTimeForPostDetails';
import {formatNumShorthand} from 'lib/FormatUtils';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  GestureResponderEvent,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import useStyles from './useStyles';

// note: props are not final
type Props = {
  disableInnerComment: boolean;

  handlePressMore: (event: GestureResponderEvent) => void;

  handlePressComment: () => void;

  handlePressLike: () => void;

  handlePressTip: () => void;

  handlePress: () => void;

  handleLongPress: (event: GestureResponderEvent) => void;

  repliesCounter: number;

  author: ProfileSummary;

  // not final
  reactions: {}[];

  creation_date: string;

  text?: string;

  attachments?: PostAttachment[];

  liked?: boolean;

  loading?: boolean;
};

const CommentItem = ({
  disableInnerComment,
  handlePressComment,
  handlePressLike,
  handlePressMore,
  handlePressTip,
  handlePress,
  handleLongPress,
  author,
  reactions,
  creation_date,
  text,
  attachments,
  liked,
  loading,
  repliesCounter,
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
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={0.8}
      style={[styles.container, styles.flexRow]}>
      <Image
        source={
          author?.profile_pic ? {uri: author.profile_pic} : defaultProfilePic
        }
        style={styles.avatar}
      />
      <View style={styles.flex}>
        <View style={styles.contentContainer}>
          <View style={styles.flexRow}>
            <View>
              <Typography.Subtitle3 style={styles.textStyle}>
                {author?.nickname ? author.nickname : t('no nickname')}
              </Typography.Subtitle3>
              <Typography.Body7 style={styles.subTextStyle}>
                @{author?.dtag}
              </Typography.Body7>
            </View>
            {/* loading indicator would go here */}
          </View>

          {loading ? (
            <ThemedLottieView
              loop
              autoPlay
              source={buildingBlockAnim}
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
              {formattedDate}
            </Typography.Body7>
          </View>

          <View style={styles.interactionButtonGroup}>
            {!disableInnerComment && (
              <TouchableOpacity
                onPress={handlePressComment}
                style={styles.interactionButton}>
                <Image
                  source={commentComment}
                  style={[styles.buttonImage, styles.interactionImage]}
                />
                <Typography.Subtitle3 style={styles.textStyle}>
                  {formatNumShorthand(repliesCounter)}
                </Typography.Subtitle3>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handlePressLike}
              style={styles.interactionButton}>
              <Image
                source={liked ? commentLiked : optionsIcon}
                style={[
                  styles.buttonImage,
                  liked ? styles.likedButton : {},
                  styles.interactionImage,
                ]}
              />
              <Typography.Subtitle3
                style={liked ? styles.likedStyle : styles.textStyle}>
                {reactions ? formatNumShorthand(reactions.length) : 0}
              </Typography.Subtitle3>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePressTip}
              style={styles.interactionButton}>
              <Image
                source={commentTip}
                style={[styles.buttonImage, styles.interactionImage]}
              />
              <Typography.Subtitle3 style={styles.textStyle}>
                {/* not implemented yet */}
                {formatNumShorthand(0)}
              </Typography.Subtitle3>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CommentItem;
