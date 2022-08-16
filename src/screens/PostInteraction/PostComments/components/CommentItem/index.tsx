import React from 'react';
import {View, Image, ImageSourcePropType, TouchableOpacity} from 'react-native';
import Typography from 'components/Typography';
import ImageButton from 'components/ImageButton';
import {
  commentComment,
  commentLiked,
  commentMore,
  commentTip,
  optionsIcon,
} from 'assets/images';
import {format} from 'date-fns';
import {formatNumShorthand} from 'lib/FormatUtils';
import ThemedLottieView from 'components/ThemedLottieView';
import {buildingBlockAnim} from 'assets/animations';
import useStyles from './useStyles';

// note: props are not final
type Props = {
  handlePressMore: () => void;

  handlePressComment: () => void;

  handlePressLike: () => void;

  handlePressTip: () => void;

  handlePress: () => void;

  nickname: string;

  dTag: string;

  numComments: number;

  numReactions: number;

  numTips: number;

  avatar: ImageSourcePropType;

  timestamp: string;

  text?: string;

  attachments?: PostAttachment[];

  liked?: boolean;

  loading?: boolean;
};

const CommentItem = ({
  handlePressComment,
  handlePressLike,
  handlePressMore,
  handlePressTip,
  handlePress,
  avatar,
  nickname,
  dTag,
  numComments,
  numReactions,
  numTips,
  timestamp,
  text,
  attachments,
  liked,
  loading,
}: Props) => {
  const styles = useStyles();

  const content = React.useMemo(() => {
    if (text && !attachments) {
      return (
        <View>
          <Typography.Body6 style={styles.contentText}>{text}</Typography.Body6>
        </View>
      );
    }

    if (attachments && attachments.length > 0) {
      const [attachment] = attachments;

      if (attachment) {
        if (attachment.content['@type'] === '/desmos.posts.v1.Media') {
          return (
            <Image
              source={{
                uri: attachment.content.uri,
              }}
              style={styles.attachmentImageStyle}
            />
          );
        }
      }
    }
  }, []);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={[styles.container, styles.flexRow]}>
      <Image source={avatar} style={styles.avatar} />
      <View style={styles.flex}>
        <View style={styles.contentContainer}>
          <View style={styles.flexRow}>
            <View>
              <Typography.Subtitle3 style={styles.textStyle}>
                {nickname}
              </Typography.Subtitle3>
              <Typography.Body7 style={styles.subTextStyle}>
                @{dTag}
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
        {content}

        <View style={styles.bottomGroup}>
          <View>
            <Typography.Body7 style={styles.subTextStyle}>
              {format(new Date(timestamp), 'd LLL, HH:mm')}
            </Typography.Body7>
          </View>

          <View style={styles.interactionButtonGroup}>
            <TouchableOpacity
              onPress={handlePressComment}
              style={styles.interactionButton}>
              <Image
                source={commentComment}
                style={[styles.buttonImage, styles.interactionImage]}
              />
              <Typography.Subtitle3 style={styles.textStyle}>
                {formatNumShorthand(numComments)}
              </Typography.Subtitle3>
            </TouchableOpacity>

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
                {formatNumShorthand(numReactions)}
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
                {formatNumShorthand(numTips)}
              </Typography.Subtitle3>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CommentItem;
