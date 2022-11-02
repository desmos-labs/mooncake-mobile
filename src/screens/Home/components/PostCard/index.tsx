import {defaultProfilePic, followedButton, followIcon} from 'assets/images';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import Typography from 'components/Typography';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import useRenderMediaAttachment from 'hooks/rendering/useRenderMediaAttachment';
import useActiveAccount from 'hooks/useActiveAccount';
import {useRecoilValue} from 'recoil';
import {isFollowingAddr} from '@recoil/following';
import ThemedLottieView from 'components/ThemedLottieView';
import {loadingWhite} from 'assets/animations';
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
}: Props) => {
  const styles = useStyles();
  const {attachments, isPending} = postData;

  const {activeAddress, profileData} = useActiveAccount();

  // Use the current active user's profile data if the post is pending
  const authorData = React.useMemo(() => {
    if (isPending) {
      return profileData || ({} as any);
    } else return postData.author;
  }, [postData, profileData]);

  const {profile_pic, nickname, dtag} = authorData;

  const {MediaAttachment} = useRenderMediaAttachment({attachments});

  // potentially causing a "too many pending callbacks" warning
  const isFollowing = useRecoilValue(isFollowingAddr(postData.author_address));

  const Avatar = React.useMemo(() => {
    if (profile_pic) {
      return (
        <ProfileHeaderButton
          imageSrc={{uri: profile_pic}}
          style={{height: 40, width: 40, alignSelf: 'center', borderRadius: 20}}
        />
      );
    }
    return (
      <ProfileHeaderButton
        imageSrc={defaultProfilePic}
        style={{height: 40, width: 40, alignSelf: 'center', borderRadius: 20}}
      />
    );
  }, [profile_pic]);

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
    // TODO: make this less naive
    console.log('Default post behavior for post id', postData.id);
    return POST_TYPE.TEXT;
  }, [postData]);

  // Hopefully we come up with a more elegant way to do this in the future
  const content = React.useMemo(() => {
    const followUnfollowButton = postData.author_address !== activeAddress && (
      <View>
        <ProfileHeaderButton
          imageSrc={isFollowing ? followedButton : followIcon}
          onPress={onPressFollow}
        />
      </View>
    );
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

            {followUnfollowButton}
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

            {followUnfollowButton}
          </View>
        </View>
      );
    }
  }, [postType, onPressFollow, activeAddress, postData.author_address]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPressDetails}
      activeOpacity={0.9}
      key={postData.id}>
      {MediaAttachment}
      {content}
      {isPending && (
        <ThemedLottieView
          source={loadingWhite}
          autoPlay
          style={{
            width: 40,
            height: 40,
            position: 'absolute',
            top: 2,
            left: 2,
          }}
        />
      )}
    </TouchableOpacity>
  );
};

export default PostCard;
