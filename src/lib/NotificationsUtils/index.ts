import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Notification, NotificationData, NotificationType } from 'types/notifications';

/**
 * Function to handle the notifications received in the background
 */
// Disable eslint since in the future we may want to add more
// functions.

export const handleBackcroundNotifications = async (
  message: FirebaseMessagingTypes.RemoteMessage,
): Promise<void> => {
  console.log('[Background-Firebase]: RemoteMessage', message);
  console.log('[Background-Firebase]: Data', message.data as Partial<NotificationData>);
};

/**
 * Gets the address of the user that originated the notification.
 * @param notification - Notification from which to get the originator.
 */
export const getNotificationOriginator = (notification: Notification): string | undefined => {
  switch (notification.additionalData.notification_type) {
    case NotificationType.NewFollower:
      return notification.additionalData.follower_address;
    case NotificationType.PostComment:
      return notification.additionalData.comment_author_address;
    case NotificationType.PostLike:
      return notification.additionalData.post_like_address;
    case NotificationType.NewTip:
      return notification.additionalData.tipper_address;
    case NotificationType.PostMention:
      return notification.additionalData.mention_author_address;
    case NotificationType.PostQuote:
      return notification.additionalData.quote_author_address;
    case NotificationType.PostReply:
      return notification.additionalData.reply_author_address;
    case NotificationType.PostRepost:
      return notification.additionalData.repost_author_address;
    case NotificationType.RelationshipCreated:
      return notification.additionalData.counterparty_address;
    default:
      return undefined;
  }
};
