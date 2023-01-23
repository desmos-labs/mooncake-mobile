import {isFollowingAddr} from '@recoil/following';
import Button from 'components/Button';
import ImageButton from 'components/ImageButton';
import Typography from 'components/Typography';
import useFormatTimeForPostDetails from 'hooks/useFormatTimeForPostDetails';
import useHandleNotificationPressEvent from 'hooks/useHandleNotificationPressEvent';
import useNavigateToProfile from 'hooks/useNavigateToProfile';
import React, {memo, useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from 'react-native-paper';
import {useRecoilValue} from 'recoil';
import {CompleteNotification} from 'screens/Activities';
import useFollowOrUnfollowUser from 'services/axios/requests/CentralizedBroadcastTx/useFollowOrUnfollow';
import PostNotificationRead from 'services/axios/requests/PostNotificationRead';
import NotificationTypesEnum from 'types/notificationTypes';
import useStyles from './useStyles';

/* type NavProps = CompositeScreenProps<
  StackScreenProps<RootNavigatorParamList, ROUTES.ACTIVITIES>,
  BottomTabScreenProps<BottomTabsParamList>
>; */

const NotificationComponent = ({
  id,
  data: {type, post_id, comment_id, reply_id, subspace_id},
  profile,
  timestamp,
  relationship_creator,
  post,
  notificationRead,
}: CompleteNotification) => {
  const {t} = useTranslation('activities');
  const theme = useTheme();
  const styles = useStyles();
  const formattedDate = useFormatTimeForPostDetails(timestamp);
  const isFollowingAddress = useRecoilValue(
    isFollowingAddr(relationship_creator || ''),
  );
  const {followOrUnfollowUser} = useFollowOrUnfollowUser();
  const {handleNavigateToProfile} = useNavigateToProfile();
  const {navigateToCorrectScreen} = useHandleNotificationPressEvent();

  const handleNavigateToNotification = useCallback(async () => {
    navigateToCorrectScreen({
      type,
      post_id,
      comment_id,
      reply_id,
      subspace_id,
    });
    if (id) {
      await PostNotificationRead(id);
    }
  }, []);

  const content = useMemo(() => {
    switch (type) {
      case NotificationTypesEnum.Reaction_Post:
      case NotificationTypesEnum.Reaction_Comment:
      case NotificationTypesEnum.Reaction_Reply: {
        return (
          <View style={styles.flexRowView}>
            <ImageButton
              onPress={() => handleNavigateToProfile(profile.address!)}
              style={styles.avatar}
              image={{uri: profile.profile_pic}}
            />
            <TouchableOpacity
              style={styles.profileView}
              onPress={handleNavigateToNotification}>
              <Typography.Subtitle3>
                {profile.nickname.trimStart()}
                <Typography.Body6>
                  {' '}
                  {type === NotificationTypesEnum.Reaction_Post &&
                    t('liked your post')}
                  {type === NotificationTypesEnum.Reaction_Comment &&
                    t('liked comment')}
                  {type === NotificationTypesEnum.Reaction_Reply &&
                    t('liked reply')}
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
              onPress={handleNavigateToNotification}>
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
              onPress={handleNavigateToNotification}>
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
              onPress={handleNavigateToNotification}>
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
              onPress={handleNavigateToNotification}>
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
              onPress={() => handleNavigateToNotification()}>
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
      default: {
        return (
          <View>
            <Typography.Body6>Not mapped or old notification</Typography.Body6>
          </View>
        );
      }
    }
  }, [
    type,
    profile.address,
    formattedDate,
    post.attachments,
    isFollowingAddress,
    handleNavigateToProfile,
    handleNavigateToNotification,
    followOrUnfollowUser,
    relationship_creator,
  ]);

  return (
    <View
      style={[
        styles.container,
        !notificationRead && {
          backgroundColor: theme.colors.butterOrange05,
        },
      ]}>
      {content}
    </View>
  );
};

export default memo(NotificationComponent);
