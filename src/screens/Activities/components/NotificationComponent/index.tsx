import {isFollowingAddr} from '@recoil/following';
import {defaultProfilePic} from 'assets/images';
import ImageButton from 'components/ImageButton';
import Typography from 'components/Typography';
import useFormatTimeForPostDetails from 'hooks/useFormatTimeForPostDetails';
import useHandleNotificationPressEvent from 'hooks/useHandleNotificationPressEvent';
import useNavigateToProfile from 'hooks/useNavigateToProfile';
import React, {memo, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useRecoilValue} from 'recoil';
import {CompleteNotification} from 'screens/Activities';
import NotificationButton from 'screens/Activities/components/NotificationButton';
import NotificationImage from 'screens/Activities/components/NotificationImage';
import useFollowOrUnfollowUser from 'services/axios/requests/CentralizedBroadcastTx/useFollowOrUnfollow';
import PostNotificationRead from 'services/axios/requests/PostNotificationRead';
import NotificationTypesEnum from 'types/notificationTypes';
import useStyles from './useStyles';

const componentMap: {[index: string]: any} = {
  [NotificationTypesEnum.Reaction_Post]: NotificationImage,
  [NotificationTypesEnum.Reaction_Comment]: NotificationImage,
  [NotificationTypesEnum.Reaction_Reply]: NotificationImage,
  [NotificationTypesEnum.Comment]: NotificationImage,
  [NotificationTypesEnum.Reply]: NotificationImage,
  [NotificationTypesEnum.Follow]: NotificationButton,
  [NotificationTypesEnum.InviteClaimed]: undefined,
  [NotificationTypesEnum.InviteUnlocked]: undefined,
};

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
        await PostNotificationRead(id);
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

  const RightComponent = componentMap[type];

  return (
    <View
      style={[
        styles.container,
        read_receipts.length === 0 && {
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
        <RightComponent
          post={post}
          handleButtonPress={() =>
            followOrUnfollowUser({
              addrToFollow: relationship_creator || '',
            })
          }
          isFollowingAddress={isFollowingAddress}
        />
      </View>
    </View>
  );
};

export default memo(NotificationComponent);
