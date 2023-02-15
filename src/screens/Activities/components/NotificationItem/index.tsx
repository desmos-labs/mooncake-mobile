import ImageButton from 'components/ImageButton';
import Typography from 'components/Typography';
import React, { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import ToggleFollowageButton from 'screens/Activities/components/ToggleFollowageButton';
import PostAttachmentsPreview from 'screens/Activities/components/PostAttachmentsPreview';
import { CompleteNotification, NotificationType } from 'types/notifications';
import useFormatTimeForPostDetails from 'hooks/useFormatTimeForPostDetails';
import { getProfileDisplayName, getProfilePicture } from 'lib/ProfileUtils';
import useNavigateToProfile from 'hooks/useNavigateToProfile';
import { GuestProfileParamsTypes } from 'screens/GuestProfile';
import useStyles from './useStyles';

export interface NotificationComponentProps {
  readonly notification: CompleteNotification;
}

/**
 * Component that represents a single notification within a list.
 * @constructor
 */
const NotificationItem = (props: NotificationComponentProps) => {
  const { t } = useTranslation('activities');
  const theme = useTheme();
  const styles = useStyles();

  const { notification } = props;

  // -------------------------------------------------------------------------------------
  // --- Formatted data
  // -------------------------------------------------------------------------------------

  const { timestamp } = notification;
  const formattedDate = useFormatTimeForPostDetails(timestamp);

  //
  // const handleNavigateToNotification = useCallback(async () => {
  //   navigateToCorrectScreen({
  //     type,
  //     post_id,
  //     comment_id,
  //     reply_id,
  //     subspace_id,
  //   });
  //   // Save the value inside GQL
  //   // Modify the cache to reflect the value change without re-fetching it
  //   if (id && read_receipts.length === 0) {
  //     try {
  //       const result = await PostNotificationRead(id);
  //       if (result) {
  //         useClient.writeFragment({
  //           fragment: NotificationReadFields,
  //           id: `notification:${id}`,
  //           data: {
  //             read_receipts: [
  //               {
  //                 __typename: 'notification_read',
  //                 read_time: Date.now(),
  //               },
  //             ],
  //           },
  //         });
  //       }
  //     } catch (e) {
  //       console.error('Mark notification read error', e);
  //     }
  //   }
  // }, [read_receipts, navigateToCorrectScreen]);

  const profile = useMemo(() => {
    switch (notification.type) {
      case NotificationType.ReactionReply:
      case NotificationType.ReactionComment:
      case NotificationType.ReactionPost:
        return notification.reaction.author;
      case NotificationType.Comment:
        return notification.comment.author;
      case NotificationType.Reply:
        return notification.reply.author;
      case NotificationType.Follow:
        return notification.user;
      case NotificationType.InviteClaimed:
        return notification.claimer;
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
      case NotificationType.InviteClaimed:
        return t('claimed your invite');
      case NotificationType.InviteUnlocked:
        return t('unlocked a new invite');
      default:
        return 'Unsupported notification type';
    }
  }, [notification, t]);

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const navigateToProfile = useNavigateToProfile();

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const handleNavigateToProfile = useCallback(() => {
    if (!profile) return;
    navigateToProfile({
      type: GuestProfileParamsTypes.COMPLETE,
      profile,
    });
  }, [navigateToProfile, profile]);

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  const RightElement = useMemo(() => {
    switch (notification.type) {
      case NotificationType.ReactionPost:
        return <PostAttachmentsPreview post={notification.post} />;
      case NotificationType.ReactionComment:
        return <PostAttachmentsPreview post={notification.comment} />;
      case NotificationType.ReactionReply:
        return <PostAttachmentsPreview post={notification.reply} />;
      case NotificationType.Comment:
        return <PostAttachmentsPreview post={notification.comment} />;
      case NotificationType.Reply:
        return <PostAttachmentsPreview post={notification.reply} />;
      case NotificationType.Follow:
        return <ToggleFollowageButton user={notification.user} />;
      default:
        return null;
    }
  }, [notification]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <View
      style={[
        styles.container,
        notification.isRead && {
          backgroundColor: theme.colors.butterOrange05,
        },
      ]}>
      <View style={styles.flexRowView}>
        {/* User profile image */}
        {profile && (
          <ImageButton
            onPress={handleNavigateToProfile}
            style={styles.avatar}
            image={getProfilePicture(profile)}
          />
        )}

        {/* Notification texts */}
        <TouchableOpacity style={styles.profileView} onPress={handleNavigateToNotification}>
          {profile && <Typography.Subtitle3>{getProfileDisplayName(profile)}</Typography.Subtitle3>}
          <Typography.Body6> {bodyText}</Typography.Body6>
          <Typography.Body7 style={styles.date}>{formattedDate}</Typography.Body7>
        </TouchableOpacity>

        {/* Right element, if any */}
        {RightElement}
      </View>
    </View>
  );
};

export default memo(NotificationItem);
