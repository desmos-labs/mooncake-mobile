import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {isFollowingAddr} from '@recoil/following';
import Button from 'components/Button';
import ImageButton from 'components/ImageButton';
import Typography from 'components/Typography';
import EnvConfig from 'config/EnvConfig';
import ToastConfig from 'config/ToastConfig';
import useActiveAccount from 'hooks/useActiveAccount';
import useFormatTimeForPostDetails from 'hooks/useFormatTimeForPostDetails';
import useNavigateToProfile from 'hooks/useNavigateToProfile';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import {BottomTabsParamList} from 'navigation/RootNavigator/BottomTabs';
import ROUTES from 'navigation/routes';
import React, {memo, useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from 'react-native-paper';
import {useToast} from 'react-native-toast-notifications';
import {useRecoilValue} from 'recoil';
import {CompleteNotification} from 'screens/Activities';
import useFollowOrUnfollowUser from 'services/axios/requests/CentralizedBroadcastTx/useFollowOrUnfollow';
import NotificationTypesEnum from 'types/notificationTypes';
import useStyles from './useStyles';

type NavProps = CompositeScreenProps<
  StackScreenProps<RootNavigatorParamList, ROUTES.ACTIVITIES>,
  BottomTabScreenProps<BottomTabsParamList>
>;

const NotificationComponent = ({
  data: {type, post_id},
  profile,
  timestamp,
  relationship_creator,
  post,
}: CompleteNotification) => {
  const {t} = useTranslation('activities');
  const theme = useTheme();
  const styles = useStyles();
  const {navigate} = useNavigation<NavProps['navigation']>();
  const formattedDate = useFormatTimeForPostDetails(timestamp);
  const isFollowingAddress = useRecoilValue(
    isFollowingAddr(relationship_creator || ''),
  );
  const {followOrUnfollowUser} = useFollowOrUnfollowUser();
  const {profileData} = useActiveAccount();
  const toast = useToast();
  const {handleNavigateToProfile} = useNavigateToProfile();
  const checkPostType = useCallback(() => {
    const isOriginalPost = post?.conversation === null;
    const reply = post?.replies.find(
      (rep: any) => rep.reference.id === post.conversation.id,
    );
    const isComment = reply !== null && !isOriginalPost;
    const isReply = !isOriginalPost && !isComment;

    return {
      isOriginalPost,
      isComment,
      isReply,
      reply,
    };
  }, []);

  const navigateToCorrectScreen = useCallback(() => {
    if (type === NotificationTypesEnum.Comment) {
      navigate(ROUTES.POST_DETAILS, {
        subspaceID: EnvConfig.APP_SUBSPACE_ID,
        postId: parseInt(post_id!, 10),
        focusCommentBox: false,
      });
    }
    if (type === NotificationTypesEnum.Reply) {
      const {reply} = checkPostType();
      if (!reply) {
        toast.show('Something went wrong', {
          type: ToastConfig.ERROR_NO_RETRY,
        });
      } else {
        navigate(ROUTES.COMMENT_REPLIES, {
          postId: post.conversation.id,
          commentId: reply.post.id,
          subspaceId: EnvConfig.APP_SUBSPACE_ID,
        });
      }
    }
    if (type === NotificationTypesEnum.Reaction) {
      const {isOriginalPost, isReply, reply} = checkPostType();
      if (!isOriginalPost) {
        if (isReply) {
          navigate(ROUTES.COMMENT_REPLIES, {
            postId: post.conversation.id,
            commentId: reply.reference.id,
            subspaceId: EnvConfig.APP_SUBSPACE_ID,
          });
        } else {
          navigate(ROUTES.COMMENT_REPLIES, {
            postId: post.conversation.id,
            commentId: parseInt(post_id!, 10),
            subspaceId: EnvConfig.APP_SUBSPACE_ID,
          });
        }
      } else {
        navigate(ROUTES.POST_DETAILS, {
          subspaceID: EnvConfig.APP_SUBSPACE_ID,
          postId: parseInt(post_id!, 10),
          focusCommentBox: false,
        });
      }
    }
    if (type === NotificationTypesEnum.Follow) {
      navigate(ROUTES.FOLLOWING_AND_FOLLOWERS, {
        screen: ROUTES.FOLLOWING,
        params: {
          subspaceID: EnvConfig.APP_SUBSPACE_ID,
          userAddress: profileData?.address!,
          headerTitle: profileData?.nickname.trim() || `@${profileData?.dtag}`,
        },
      });
    }
    if (type === NotificationTypesEnum.InviteClaimed) {
      navigate(ROUTES.GUEST_PROFILE, {
        address: profile?.address!,
      });
    }
    if (type === NotificationTypesEnum.InviteUnlocked) {
      navigate(ROUTES.INVITES);
    }
  }, [profileData]);

  const content = useMemo(() => {
    switch (type) {
      case NotificationTypesEnum.Reaction: {
        const {isOriginalPost, isComment, isReply} = checkPostType();
        return (
          <View style={styles.flexRowView}>
            <ImageButton
              onPress={() => handleNavigateToProfile(profile.address!)}
              style={styles.avatar}
              image={{uri: profile.profile_pic}}
            />
            <TouchableOpacity
              style={styles.profileView}
              onPress={navigateToCorrectScreen}>
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
            </TouchableOpacity>
            {post?.attachments.length > 0 && (
              <FastImage
                style={styles.postImage}
                source={{uri: post.attachments[0].content.uri}}
              />
            )}
          </View>
        );
      }
      case NotificationTypesEnum.Comment:
        return (
          <View style={styles.flexRowView}>
            <ImageButton
              onPress={() => handleNavigateToProfile(profile.address!)}
              style={styles.avatar}
              image={{uri: profile.profile_pic}}
            />
            <TouchableOpacity
              style={styles.profileView}
              onPress={navigateToCorrectScreen}>
              <Typography.Subtitle3>
                {profile.nickname.trimStart()}
                <Typography.Body6> {t('commented')}</Typography.Body6>
              </Typography.Subtitle3>
              <Typography.Body7 style={{color: theme.colors.grey02}}>
                {formattedDate}
              </Typography.Body7>
            </TouchableOpacity>
            {post?.attachments.length > 0 && (
              <FastImage
                style={styles.postImage}
                source={{uri: post.attachments[0].content.uri}}
              />
            )}
          </View>
        );
      case NotificationTypesEnum.Reply:
        return (
          <View style={styles.flexRowView}>
            <ImageButton
              onPress={() => handleNavigateToProfile(profile.address!)}
              style={styles.avatar}
              image={{uri: profile.profile_pic}}
            />
            <TouchableOpacity
              style={styles.profileView}
              onPress={navigateToCorrectScreen}>
              <Typography.Subtitle3>
                {profile.nickname.trimStart()}
                <Typography.Body6> {t('commented reply')}</Typography.Body6>
              </Typography.Subtitle3>
              <Typography.Body7 style={{color: theme.colors.grey02}}>
                {formattedDate}
              </Typography.Body7>
            </TouchableOpacity>
            {post?.attachments.length > 0 && (
              <FastImage
                style={styles.postImage}
                source={{uri: post.attachments[0].content.uri}}
              />
            )}
          </View>
        );
      case NotificationTypesEnum.Follow:
        return (
          <View style={styles.flexRowView}>
            <ImageButton
              onPress={() => handleNavigateToProfile(profile.address!)}
              style={styles.avatar}
              image={{uri: profile.profile_pic}}
            />
            <TouchableOpacity
              style={styles.profileView}
              onPress={navigateToCorrectScreen}>
              <Typography.Subtitle3>
                {profile.nickname.trimStart()}
                <Typography.Body6> {t('followed you')}</Typography.Body6>
              </Typography.Subtitle3>
              <Typography.Body7 style={{color: theme.colors.grey02}}>
                {formattedDate}
              </Typography.Body7>
            </TouchableOpacity>
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
      case NotificationTypesEnum.InviteClaimed:
        return (
          <View style={styles.flexRowView}>
            <ImageButton
              onPress={() => handleNavigateToProfile(profile.address!)}
              style={styles.avatar}
              image={{uri: profile.profile_pic}}
            />
            <TouchableOpacity
              style={styles.profileView}
              onPress={navigateToCorrectScreen}>
              <Typography.Subtitle3>
                @{profile.dtag.trimStart()}
                <Typography.Body6> {t('claimed your invite')}</Typography.Body6>
              </Typography.Subtitle3>
              <Typography.Body7 style={{color: theme.colors.grey02}}>
                {formattedDate}
              </Typography.Body7>
            </TouchableOpacity>
          </View>
        );
      case NotificationTypesEnum.InviteUnlocked:
        return (
          <View style={styles.flexRowView}>
            <ImageButton
              onPress={() => handleNavigateToProfile(profile.address!)}
              style={styles.avatar}
              image={{uri: profile.profile_pic}}
            />
            <TouchableOpacity
              style={styles.profileView}
              onPress={navigateToCorrectScreen}>
              <Typography.Subtitle3>
                {t('you')}{' '}
                <Typography.Body6>
                  {t('unlocked a new invite')}
                </Typography.Body6>
              </Typography.Subtitle3>
              <Typography.Body7 style={{color: theme.colors.grey02}}>
                {formattedDate}
              </Typography.Body7>
            </TouchableOpacity>
          </View>
        );
      default:
        return (
          <View>
            <Typography.Body6>Not mapped</Typography.Body6>
          </View>
        );
    }
  }, [formattedDate, isFollowingAddress, followOrUnfollowUser, checkPostType]);

  return <View style={styles.container}>{content}</View>;
};

export default memo(NotificationComponent);
