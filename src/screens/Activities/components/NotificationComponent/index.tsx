import {isFollowingAddr} from '@recoil/following';
import {defaultProfilePic} from 'assets/images';
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

const NotificationComponent = ({
  id,
  data: {type, post_id, comment_id, reply_id, subspace_id},
  profile,
  timestamp,
  relationship_creator,
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
    if (id) {
      await PostNotificationRead(id);
    }
  }, []);

  const Avatar = useMemo(() => {
    return (
      <ImageButton
        onPress={() => handleNavigateToProfile(profile.address)}
        style={styles.avatar}
        image={
          profile?.profile_pic ? {uri: profile?.profile_pic} : defaultProfilePic
        }
      />
    );
  }, [handleNavigateToProfile, profile.address, profile?.profile_pic]);

  const RightImage = useMemo(() => {
    return (
      post?.attachments.length > 0 && (
        <FastImage
          style={styles.postImage}
          source={{uri: post.attachments[0].content.uri}}
        />
      )
    );
  }, [post.attachments]);

  const FormattedDate = useMemo(() => {
    return (
      <Typography.Body7 style={{color: theme.colors.grey02}}>
        {formattedDate}
      </Typography.Body7>
    );
  }, [formattedDate]);

  const FollowButton = useMemo(() => {
    return isFollowingAddress ? (
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
    );
  }, [followOrUnfollowUser, isFollowingAddress, relationship_creator]);

  const bodyText = useMemo(() => {
    switch (type) {
      case NotificationTypesEnum.Reaction_Post:
        return t('liked your post');
      case NotificationTypesEnum.Reaction_Comment:
        return t('liked comment');
      case NotificationTypesEnum.Reaction_Reply:
        return t('liked reply');
      case NotificationTypesEnum.Comment:
        return t('commented');
      case NotificationTypesEnum.Reply:
        return t('commented reply');
      case NotificationTypesEnum.Follow:
        return t('followed you');
      case NotificationTypesEnum.InviteClaimed:
        return t('claimed your invite');
      case NotificationTypesEnum.InviteUnlocked:
        return t('unlocked a new invite');
    }
  }, [type]);

  const content = useMemo(() => {
    switch (type) {
      case NotificationTypesEnum.Reaction_Post:
      case NotificationTypesEnum.Reaction_Comment:
      case NotificationTypesEnum.Reaction_Reply:
      case NotificationTypesEnum.Comment:
      case NotificationTypesEnum.Reply: {
        return (
          <>
            {Avatar}
            <TouchableOpacity
              style={styles.profileView}
              onPress={handleNavigateToNotification}>
              <Typography.Subtitle3>
                {profile.nickname.trimStart()}
                <Typography.Body6> {bodyText}</Typography.Body6>
              </Typography.Subtitle3>
              {FormattedDate}
            </TouchableOpacity>
            {RightImage}
          </>
        );
      }
      case NotificationTypesEnum.Follow:
        return (
          <>
            {Avatar}
            <TouchableOpacity
              style={styles.profileView}
              onPress={handleNavigateToNotification}>
              <Typography.Subtitle3>
                {profile.nickname.trimStart()}
                <Typography.Body6> {bodyText}</Typography.Body6>
              </Typography.Subtitle3>
              {FormattedDate}
            </TouchableOpacity>
            <View style={styles.buttonView}>{FollowButton}</View>
          </>
        );
      case NotificationTypesEnum.InviteClaimed:
        return (
          <>
            {Avatar}
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
          </>
        );
      case NotificationTypesEnum.InviteUnlocked:
        return (
          <>
            {Avatar}
            <TouchableOpacity
              style={styles.profileView}
              onPress={handleNavigateToNotification}>
              <Typography.Subtitle3>
                {t('you')} <Typography.Body6> {bodyText}</Typography.Body6>
              </Typography.Subtitle3>
              <Typography.Body7 style={{color: theme.colors.grey02}}>
                {formattedDate}
              </Typography.Body7>
            </TouchableOpacity>
          </>
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
    Avatar,
    handleNavigateToNotification,
    profile.nickname,
    profile.dtag,
    bodyText,
    FormattedDate,
    FollowButton,
    formattedDate,
    RightImage,
  ]);

  return (
    <View
      style={[
        styles.container,
        read_receipts.length === 0 && {
          backgroundColor: theme.colors.butterOrange05,
        },
      ]}>
      <View style={styles.flexRowView}>{content}</View>
    </View>
  );
};

export default memo(NotificationComponent);
