import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import Typography from 'components/Typography';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import Spacer from 'components/Spacer';
import {blogDetails, followedButton, followIcon} from 'assets/images';
import {useTheme} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
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

  /**
   * Is the user following the author?
   */
  followed?: boolean;
};

enum POST_TYPE {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  IMAGE_TEXT = 'IMAGE_TEXT',
}

// The post dimensions are controlled by the Carousel
const PostCard = ({
  postData,
  onPressAuthor,
  onPressFollow,
  onPressDetails,
  followed,
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

  const postType: POST_TYPE = React.useMemo(() => {
    if (postData.text && postData.attachments.length === 0) {
      return POST_TYPE.TEXT;
    }
    if (postData.text && postData.attachments.length > 0) {
      return POST_TYPE.IMAGE_TEXT;
    }
    if (!postData.text && postData.attachments.length > 0) {
      return POST_TYPE.IMAGE;
    }

    // This should never be reached. Logged post id's should be checked for
    // validity
    console.log('Default post behavior for post id', postData.id);
    return POST_TYPE.TEXT;
  }, []);

  // Hopefully we come up with a more elegant way to do this in the future
  const content = React.useMemo(() => {
    if (postType === POST_TYPE.TEXT || postType === POST_TYPE.IMAGE) {
      return (
        <>
          <View style={styles.textContainer}>
            <Typography.H2 style={styles.textStyle}>
              {postData.text}
            </Typography.H2>
          </View>
          <View style={styles.bottomGroup}>
            <TouchableOpacity
              onPress={onPressAuthor}
              style={styles.profileGroup}>
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
              <ProfileHeaderButton
                imageSrc={followed ? followedButton : followIcon}
                onPress={onPressFollow}
              />

              <Spacer paddingTop={theme.spacing.m}>
                <ProfileHeaderButton
                  imageSrc={blogDetails}
                  onPress={onPressDetails}
                />
              </Spacer>
            </View>
          </View>
        </>
      );
    }
    if (postType === POST_TYPE.IMAGE_TEXT) {
      return (
        <View>
          <LinearGradient
            style={styles.textGradient}
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,1)']}
          />
          <View style={styles.bottomGroup}>
            <View style={{flex: 1}}>
              <TouchableOpacity
                onPress={onPressAuthor}
                style={styles.profileGroup}>
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
              <Typography.Body7 numberOfLines={2} style={styles.imagePostText}>
                {postData.text}
              </Typography.Body7>
            </View>

            <View>
              <ProfileHeaderButton
                imageSrc={followIcon}
                onPress={onPressFollow}
              />

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
    }
  }, [followed, postType, onPressFollow]);

  return (
    <View style={styles.container}>
      {AttachmentImage}
      {content}
    </View>
  );
};

export default PostCard;
