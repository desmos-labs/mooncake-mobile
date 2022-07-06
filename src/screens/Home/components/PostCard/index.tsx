import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import Typography from 'components/Typography';
import ProfileHeaderButton from 'screens/Home/components/ProfileHeaderButton';
import Spacer from 'components/Spacer';
import {blogDetails, followIcon} from 'assets/images';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

type Props = {
  /**
   * The data of the post retrieved from a query.
   */
  postData: PostItem;

  /**
   * What to do when the author's avatar, name, or dtag is pressed.
   */
  onPressAuthor: () => void;

  /**
   * What to do if the follow button is pressed.
   */
  onPressFollow: () => void;

  /**
   * What to do if the post details button is pressed.
   */
  onPressDetails: () => void;
};

// The post dimensions are controlled by the Carousel
const PostCard = ({
  postData,
  onPressAuthor,
  onPressFollow,
  onPressDetails,
}: Props) => {
  const styles = useStyles();
  const theme = useTheme();

  const {
    author: {dtag, nickname, profile_pic},
    attachments,
  } = postData;

  const Avatar = React.useMemo(() => {
    if (profile_pic) {
      return <ProfileHeaderButton imageSrc={{uri: profile_pic}} />;
    }
    return <View style={styles.blankAvatar} />;
  }, [profile_pic]);

  const AttachmentImage = React.useMemo(() => {
    const [attachment] = attachments;

    if (attachment) {
      if (attachment.content['@type'] === '/desmos.posts.v1.Media') {
        return (
          <Image
            source={{
              uri: attachment.content.uri,
            }}
            style={StyleSheet.absoluteFillObject}
          />
        );
      }
    }
    return undefined;
  }, []);

  return (
    <View style={styles.container}>
      {AttachmentImage}
      <View style={styles.textContainer}>
        <Typography.H2 style={styles.textStyle}>{postData.text}</Typography.H2>
      </View>
      <View style={styles.bottomGroup}>
        <TouchableOpacity onPress={onPressAuthor} style={styles.profileGroup}>
          {Avatar}
          <View style={styles.nameGroup}>
            {nickname && (
              <Typography.Subtitle2 style={styles.profileText}>
                {nickname}
              </Typography.Subtitle2>
            )}

            <Typography.Body6 style={styles.profileText}>
              {`@${dtag}`}
            </Typography.Body6>
          </View>
        </TouchableOpacity>

        <View>
          <ProfileHeaderButton imageSrc={followIcon} onPress={onPressFollow} />

          <Spacer paddingTop={theme.spacing.m}>
            <ProfileHeaderButton
              imageSrc={blogDetails}
              onPress={onPressDetails}
            />
          </Spacer>
        </View>
      </View>
    </View>
  );
};

export default PostCard;
