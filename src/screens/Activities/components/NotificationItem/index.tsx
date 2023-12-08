import ImageButton from 'components/ImageButton';
import Typography from 'components/Typography';
import React, { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import ToggleFollowageButton from 'screens/Activities/components/ToggleFollowageButton';
import PostAttachmentsPreview from 'screens/Activities/components/PostAttachmentsPreview';
import { CompleteNotification, NotificationType } from 'types/notifications';
import useFormatTimeForPostDetails from 'hooks/formatting/useFormatTimeForPostDetails';
import { getProfileDisplayName, getProfilePicture } from 'lib/ProfileUtils';
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
import useHandleNotificationPressEvent from 'hooks/notifications/useHandleNotificationPressEvent';
import useToast from 'hooks/toasts/useToast';
import { ToastType } from 'config/toast/toastConfig';
import useStyles from './useStyles';

interface NotificationComponentProps {
  readonly notification: CompleteNotification;
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
  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const navigateToProfile = useNavigateToProfile();
  const handleNotificationPressEvent = useHandleNotificationPressEvent();

  // -------------------------------------------------------------------------------------
  // --- Formatted data
  // -------------------------------------------------------------------------------------

  const { timestamp } = notification;
  const formatDate = useFormatTimeForPostDetails();
  const formattedDate = formatDate(timestamp);

  // Get the profile address and the profile details of the other user involved in the notification
  const [profileAddress, profile] = useMemo(() => {
    switch (notification.type) {
      case NotificationType.ReactionReply:
      case NotificationType.ReactionComment:
      case NotificationType.ReactionPost:
        return [notification.reactionAuthorAddress, notification.reaction?.author];
      case NotificationType.Comment:
        return [notification.commentAuthorAddress, notification.comment?.author];
      case NotificationType.Reply:
        return [notification.replyAuthorAddress, notification.reply?.author];
      case NotificationType.Follow:
        return [notification.userAddress, notification.user];
      default:
        return [undefined, undefined];
    }
  }, [notification]);

  const post = useMemo(() => {
    switch (notification.type) {
      case NotificationType.ReactionPost:
        return notification.post;
      case NotificationType.ReactionComment:
        return notification.comment;
      case NotificationType.ReactionReply:
        return notification.reply;
      case NotificationType.Comment:
        return notification.comment;
      case NotificationType.Reply:
        return notification.reply;
      default:
        return undefined;
    }
  }, [notification]);

  const bodyText = useMemo(() => {
    switch (notification.type) {
      case NotificationType.ReactionPost:
        return t('liked your post');
      case NotificationType.ReactionComment:
        return t('liked comment');
      case NotificationType.ReactionReply:
        return t('liked reply');
      case NotificationType.Comment:
        return t('commented');
      case NotificationType.Reply:
        return t('commented reply');
      case NotificationType.Follow:
        return t('followed you');
      default:
        return 'Unsupported notification type';
    }
  }, [notification, t]);

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

  const handleNavigateToNotification = useCallback(() => {
    // TODO: Probably we should handle the error somehow
    handleNotificationPressEvent(notification);
  }, [handleNotificationPressEvent, notification]);

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  const RightElement = useMemo(() => {
    if (post) {
      return <PostAttachmentsPreview post={post} />;
    }

    if (notification.type === NotificationType.Follow) {
      const { user } = notification;
      return user && <ToggleFollowageButton user={user} />;
    }

    return null;
  }, [notification, post]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <View style={[styles.container]}>
      <View style={styles.flexRowView}>
        {/* User profile image */}
        <ImageButton
          onPress={handleNavigateToProfile}
          style={styles.avatar}
          image={getProfilePicture(profile)}
        />

        {/* Notification texts */}
        <TouchableOpacity style={styles.profileView} onPress={handleNavigateToNotification}>
          {profile && <Typography.Subtitle3>{getProfileDisplayName(profile)}</Typography.Subtitle3>}
          {!profile && profileAddress && (
            <Typography.Subtitle3
              style={styles.profileAddressText}
              lineBreakMode="middle"
              numberOfLines={1}>
              {profileAddress}
            </Typography.Subtitle3>
          )}
          <Typography.Body6>{bodyText}</Typography.Body6>
          <Typography.Body7 style={styles.date}>{formattedDate}</Typography.Body7>
        </TouchableOpacity>

        {/* Right element, if any */}
        {RightElement}
      </View>
    </View>
  );
};

export default memo(NotificationItem);
