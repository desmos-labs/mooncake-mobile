import AvatarImage from 'components/AvatarImage';
import Typography from 'components/Typography';
import { ToastType } from 'config/toast/toastConfig';
import useFormatTimeForPostDetails from 'hooks/formatting/useFormatTimeForPostDetails';
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
import useGetOnChainProfile from 'hooks/profiles/useGetOnChainProfile';
import useToast from 'hooks/toasts/useToast';
import { getNotificationOriginator } from 'lib/NotificationsUtils';
import { getProfileDisplayName } from 'lib/ProfileUtils';
import React, { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import PostAttachmentsPreview from 'screens/Activities/components/PostAttachmentsPreview';
import ToggleFollowageButton from 'screens/Activities/components/ToggleFollowageButton';
import { DesmosProfile } from 'types/desmos';
import { Notification, NotificationType } from 'types/notifications';
import useStyles from './useStyles';

interface NotificationComponentProps {
  readonly notification: Notification;
}

/**
 * Component that represents a single notification within a list.
 * @constructor
 */
const NotificationItem = (props: NotificationComponentProps) => {
  const { t } = useTranslation('activities');
  const styles = useStyles();
  const showToast = useToast();
  const { notification } = props;
  const getProfile = useGetOnChainProfile();

  const [loadingProfile, setLoadingProfile] = React.useState(
    getNotificationOriginator(notification) !== undefined,
  );
  const [profile, setProfile] = React.useState<DesmosProfile>();

  // -------- VARIABLES ---------

  const notificationOriginator = React.useMemo(() => {
    const ori = getNotificationOriginator(notification);
    console.log('ORI', ori);
    return ori;
  }, [notification]);

  // -------- CALLBACKS --------

  const onNotificationPressed = React.useCallback(() => {
    console.log('test');
  }, [notification]);

  // -------- EFFECTS --------

  React.useEffect(() => {
    if (notificationOriginator) {
      setLoadingProfile(true);
      setProfile(undefined);
      getProfile(notificationOriginator)
        .then(p => {
          setProfile(p);
        })
        .catch(e => {
          console.log(e);
        })
        .finally(() => {
          setLoadingProfile(false);
        });
    }
    return () => {
      setProfile(undefined);
      setLoadingProfile(true);
    };
  }, [getProfile, notificationOriginator, t]);

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const navigateToProfile = useNavigateToProfile();

  // -------------------------------------------------------------------------------------
  // --- Formatted data
  // -------------------------------------------------------------------------------------

  const { timestamp } = notification;
  const formatDate = useFormatTimeForPostDetails();
  const formattedDate = formatDate(timestamp);

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const handleNavigateToProfile = useCallback(() => {
    if (!profile) {
      showToast({
        toastType: ToastType.error,
        title: t('error', { ns: 'common' }),
        message: t('profileNotFound'),
      });
      return;
    }
    navigateToProfile(profile.address);
  }, [navigateToProfile, profile, showToast, t]);

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  const RightElement = useMemo(() => {
    if (notification.imageUrl) {
      return <PostAttachmentsPreview imageUrl={notification.imageUrl} />;
    }

    if (notification.type === NotificationType.NewFollower) {
      return profile && <ToggleFollowageButton user={profile} />;
    }

    return null;
  }, [notification.imageUrl, notification.type, profile]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <View style={[styles.container]}>
      <View style={styles.flexRowView}>
        {/* User profile image */}
        <AvatarImage
          profile={profile}
          size={40}
          loading={loadingProfile}
          onPress={handleNavigateToProfile}
        />
        {/* Notification texts */}
        <TouchableOpacity style={styles.profileView}>
          {profile && <Typography.Subtitle3>{getProfileDisplayName(profile)}</Typography.Subtitle3>}
          <Typography.Body6>{notification.title}</Typography.Body6>
          <Typography.Body7 style={styles.date}>{formattedDate}</Typography.Body7>
        </TouchableOpacity>
        {/* Right element, if any */}
        {RightElement}
      </View>
    </View>
  );
};

export default memo(NotificationItem);
