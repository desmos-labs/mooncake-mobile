import {useQuery} from '@apollo/client';
import appSettingsState from '@recoil/settings';
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
import {utcToZonedTime} from 'date-fns-tz';
import {formatNumShorthand} from 'lib/FormatUtils';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {
  GestureResponderEvent,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import {useRecoilState} from 'recoil';
import {GetPostCommentsCount} from 'services/graphql/queries/GetComments';
import useStyles from './useStyles';

// note: props are not final
type Props = {
  handlePressMore: () => void;

  handlePressComment: () => void;

  handlePressLike: () => void;

  handlePressTip: () => void;

  handlePress: () => void;

  handleLongPress: (event: GestureResponderEvent) => void;

  id: number;

  subspace_id: number;

  author: {
    address: string;
    bio: string;
    dtag: string;
    nickname: string;
    profile_pic: string;
  };

  // not final
  reactions: {}[];

  creation_date: string;

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
  handleLongPress,
  author,
  reactions,
  creation_date,
  text,
  attachments,
  liked,
  loading,
  id,
  subspace_id,
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const [settings] = useRecoilState(appSettingsState);
  const {data} = useQuery(GetPostCommentsCount, {
    variables: {
      subspaceID: subspace_id,
      postID: id,
    },
  });

  const commentsCount = useMemo(() => {
    if (!data) return 0;

    return data.post_aggregate.aggregate.count;
  }, [data]);

  const formattedDate = useMemo(
    () => utcToZonedTime(creation_date, settings.currentTimezone),
    [creation_date],
  );

  const content = React.useMemo(() => {
    console.log('useMemo');
    if (text && attachments?.length === 0) {
      console.log('text');
      return (
        <View>
          <Typography.Body6 style={styles.contentText}>{text}</Typography.Body6>
        </View>
      );
    }

    if (attachments && attachments.length > 0) {
      const [attachment] = attachments;
      console.log('attachment');

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
  }, [attachments, text]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={0.8}
      style={[styles.container, styles.flexRow]}>
      <Image
        source={
          author.profile_pic ? {uri: author.profile_pic} : defaultProfilePic
        }
        style={styles.avatar}
      />
      <View style={styles.flex}>
        <View style={styles.contentContainer}>
          <View style={styles.flexRow}>
            <View>
              <Typography.Subtitle3 style={styles.textStyle}>
                {author.nickname ? author.nickname : t('no nickname')}
              </Typography.Subtitle3>
              <Typography.Body7 style={styles.subTextStyle}>
                @{author.dtag}
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
              {formattedDate.toDateString()}
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
                {formatNumShorthand(commentsCount)}
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
                {formatNumShorthand(reactions.length)}
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
