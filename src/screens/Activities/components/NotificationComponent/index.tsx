import {isFollowingAddr} from '@recoil/following';
import Button from 'components/Button';
import Typography from 'components/Typography';
import EnvConfig from 'config/EnvConfig';
import useFormatTimeForPostDetails from 'hooks/useFormatTimeForPostDetails';
import ROUTES from 'navigation/routes';
import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, TouchableOpacity, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useRecoilValue} from 'recoil';
import useFollowOrUnfollowUser from 'services/axios/requests/CentralizedBroadcastTx/useFollowOrUnfollow';
import useStyles from './useStyles';

interface Props {
  type: string;
  post_id?: string;
  timestamp: string;
  profile?: any;
  relationship_creator?: string;
  post?: any;
  navigation: any;
}

const Activities = ({
  type,
  post_id,
  profile,
  timestamp,
  relationship_creator,
  post,
  navigation,
}: Props) => {
  const {t} = useTranslation('activities');
  const theme = useTheme();
  const styles = useStyles();
  const formattedDate = useFormatTimeForPostDetails(timestamp);
  const isFollowingAddress = useRecoilValue(
    isFollowingAddr(relationship_creator || ''),
  );
  const {followOrUnfollowUser} = useFollowOrUnfollowUser();

  const checkPostType = useCallback(() => {
    const isOriginalPost = !post.conversation;
    const reply = post.replies.find(
      (rep: any) => rep.reference.id === post.conversation.id,
    );
    const isComment = post.replies.length !== 0 && !reply;
    const isReply = !isOriginalPost && !isComment;

    return {
      isOriginalPost,
      isComment,
      isReply,
      reply,
    };
  }, [post]);

  const content = useMemo(() => {
    switch (type) {
      case 'reaction': {
        const {isOriginalPost, isComment, isReply} = checkPostType();
        return (
          <View style={{flexDirection: 'row'}}>
            <Image style={styles.avatar} source={{uri: profile.profile_pic}} />
            <View style={styles.profileView}>
              <Typography.Subtitle3>
                {profile.nickname.trimStart()}
                <Typography.Body6>
                  {' '}
                  {isOriginalPost && t('liked your post')}
                  {isComment && t('liked comment')}
                  {isReply && t('liked reply')}
                </Typography.Body6>
              </Typography.Subtitle3>
              <Typography.Body7 style={{color: theme.colors.grey02}}>
                {formattedDate}
              </Typography.Body7>
            </View>
            {post.attachments[0] && (
              <Image
                style={styles.postImage}
                source={{uri: post.attachments[0].content.uri}}
              />
            )}
          </View>
        );
      }
      case 'comment':
        return (
          <View style={{flexDirection: 'row'}}>
            <Image style={styles.avatar} source={{uri: profile.profile_pic}} />
            <View style={styles.profileView}>
              <Typography.Subtitle3>
                {profile.nickname.trimStart()}
                <Typography.Body6> {t('commented')}</Typography.Body6>
              </Typography.Subtitle3>
              <Typography.Body7 style={{color: theme.colors.grey02}}>
                {formattedDate}
              </Typography.Body7>
            </View>
            {post.attachments[0] && (
              <Image
                style={styles.postImage}
                source={{uri: post.attachments[0].content.uri}}
              />
            )}
          </View>
        );
      case 'reply':
        return (
          <View style={{flexDirection: 'row'}}>
            <Image style={styles.avatar} source={{uri: profile.profile_pic}} />
            <View style={styles.profileView}>
              <Typography.Subtitle3>
                {profile.nickname.trimStart()}
                <Typography.Body6> {t('commented reply')}</Typography.Body6>
              </Typography.Subtitle3>
              <Typography.Body7 style={{color: theme.colors.grey02}}>
                {formattedDate}
              </Typography.Body7>
            </View>
            {post.attachments[0] && (
              <Image
                style={styles.postImage}
                source={{uri: post.attachments[0].content.uri}}
              />
            )}
          </View>
        );
      case 'follow':
        return (
          <View style={{flexDirection: 'row'}}>
            <Image style={styles.avatar} source={{uri: profile.profile_pic}} />
            <View style={styles.profileView}>
              <Typography.Subtitle3>
                {profile.nickname.trimStart()}
                <Typography.Body6> {t('followed you')}</Typography.Body6>
              </Typography.Subtitle3>
              <Typography.Body7 style={{color: theme.colors.grey02}}>
                {formattedDate}
              </Typography.Body7>
            </View>
            <View style={styles.buttonView}>
              {isFollowingAddress ? (
                <Button
                  onPress={() =>
                    followOrUnfollowUser({addrToFollow: relationship_creator!})
                  }
                  mode="outlined"
                  color={theme.colors.surfaceBlack}
                  style={styles.followButton}>
                  <Typography.Button3
                    style={{
                      alignSelf: 'center',
                    }}>
                    {t('followingAndFollowers:unfollow')}
                  </Typography.Button3>
                </Button>
              ) : (
                <Button
                  onPress={() =>
                    followOrUnfollowUser({addrToFollow: relationship_creator!})
                  }
                  mode="contained"
                  color={theme.colors.butterOrange01}
                  style={styles.followButton}>
                  <Typography.Button3
                    style={{color: theme.colors.white, alignSelf: 'center'}}>
                    {t('followingAndFollowers:follow')}
                  </Typography.Button3>
                </Button>
              )}
            </View>
          </View>
        );
      default:
        return <View />;
    }
  }, [
    type,
    profile,
    t,
    formattedDate,
    post,
    isFollowingAddress,
    checkPostType,
    followOrUnfollowUser,
    relationship_creator,
  ]);

  const navigateToCorrectScreen = useCallback(() => {
    const {isOriginalPost, reply} = checkPostType();
    const isReply = reply && post.replies.length !== 0;
    if (type === 'comment') {
      navigation.navigate(ROUTES.POST_DETAILS, {
        subspaceID: EnvConfig.APP_SUBSPACE_ID,
        postId: post_id,
        focusCommentBox: false,
      });
    }
    if (type === 'reply') {
      navigation.navigate(ROUTES.COMMENT_REPLIES, {
        postId: post.conversation.id,
        commentId: reply.post.id,
        subspaceId: EnvConfig.APP_SUBSPACE_ID,
      });
    }
    if (type === 'reaction') {
      if (!isOriginalPost) {
        if (isReply) {
          navigation.navigate(ROUTES.COMMENT_REPLIES, {
            postId: post.conversation.id,
            commentId: reply.reference.id,
            subspaceId: EnvConfig.APP_SUBSPACE_ID,
          });
        } else {
          navigation.navigate(ROUTES.COMMENT_REPLIES, {
            postId: post.conversation.id,
            commentId: post_id,
            subspaceId: EnvConfig.APP_SUBSPACE_ID,
          });
        }
      } else {
        navigation.navigate(ROUTES.POST_DETAILS, {
          subspaceID: EnvConfig.APP_SUBSPACE_ID,
          postId: post_id,
          focusCommentBox: false,
        });
      }
    }
  }, [checkPostType, post, type, navigation, post_id]);

  return (
    <TouchableOpacity
      onPress={navigateToCorrectScreen}
      style={styles.container}>
      {content}
    </TouchableOpacity>
  );
};

export default Activities;
