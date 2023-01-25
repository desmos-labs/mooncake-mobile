import {isFollowingAddr} from '@recoil/following';
import {defaultProfilePic} from 'assets/images';
import Button from 'components/Button';
import ImageButton from 'components/ImageButton';
import Typography from 'components/Typography';
import useFormatTimeForPostDetails from 'hooks/useFormatTimeForPostDetails';
import useHandleNotificationPressEvent from 'hooks/useHandleNotificationPressEvent';
import useNavigateToProfile from 'hooks/useNavigateToProfile';
import React, {memo, useCallback} from 'react';
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

const NotificationComponent = ({
  id,
  data: {
    type,
    post_id,
    comment_id,
    reply_id,
    subspace_id,
    relationship_creator,
  },
  profile,
  timestamp,
  post,
  read_receipts,
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
    if (id && read_receipts.length === 0) {
      try {
        const result = await PostNotificationRead(id);
        console.log(result.data);
      } catch (e) {
        console.error('Mark notification read error', e);
      }
    }
  }, [read_receipts, navigateToCorrectScreen]);

  const bodyTextMap: {[index: string]: string} = {
    [NotificationTypesEnum.Reaction_Post]: t('liked your post'),
    [NotificationTypesEnum.Reaction_Comment]: t('liked comment'),
    [NotificationTypesEnum.Reaction_Reply]: t('liked reply'),
    [NotificationTypesEnum.Comment]: t('commented'),
    [NotificationTypesEnum.Reply]: t('commented reply'),
    [NotificationTypesEnum.Follow]: t('followed you'),
    [NotificationTypesEnum.InviteClaimed]: t('claimed your invite'),
    [NotificationTypesEnum.InviteUnlocked]: t('unlocked a new invite'),
  };

  const RenderRightComponent = () => {
    switch (type) {
      case NotificationTypesEnum.Reaction_Post:
      case NotificationTypesEnum.Reaction_Comment:
      case NotificationTypesEnum.Reaction_Reply:
      case NotificationTypesEnum.Comment:
      case NotificationTypesEnum.Reply: {
        return (
          post?.attachments.length > 0 && (
            <FastImage
              style={styles.postImage}
              source={{uri: post.attachments[0].content.uri}}
            />
          )
        );
      }
      case NotificationTypesEnum.Follow:
        return (
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
        );
      default:
        return undefined;
    }
  };

  return (
    <View
      style={[
        styles.container,
        read_receipts.length > 0 && {
          backgroundColor: theme.colors.butterOrange05,
        },
      ]}>
      <View style={styles.flexRowView}>
        <ImageButton
          onPress={() => handleNavigateToProfile(profile.address)}
          style={styles.avatar}
          image={
            profile?.profile_pic
              ? {uri: profile?.profile_pic}
              : defaultProfilePic
          }
        />
        <TouchableOpacity
          style={styles.profileView}
          onPress={handleNavigateToNotification}>
          <Typography.Subtitle3>
            {profile.nickname.trimStart()}
            <Typography.Body6> {bodyTextMap[type]}</Typography.Body6>
          </Typography.Subtitle3>
          <Typography.Body7 style={{color: theme.colors.grey02}}>
            {formattedDate}
          </Typography.Body7>
        </TouchableOpacity>
        {RenderRightComponent()}
      </View>
    </View>
  );
};

export default memo(NotificationComponent);
