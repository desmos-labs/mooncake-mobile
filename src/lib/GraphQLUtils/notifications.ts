import { CompleteNotificationData, NotificationData } from 'types/notifications';
import { parseRemoteNotification } from 'lib/NotificationsUtils';

/**
 * Object that contains the data returned by the GraphQL server for a single notification.
 */
export interface GraphQLNotification extends Omit<CompleteNotificationData, 'type'> {
  readonly data: NotificationData;
}

/**
 * Format an incoming notification data from the server into a format that is easier to parse by the app.
 * @param {any} notification - Notification fetched from the server.
 * @returns {GraphQLNotification} - A formatted {@link GraphQLNotification} object
 */
export const convertGraphQLNotification = (notification: any): GraphQLNotification | undefined => {
  const notificationData = parseRemoteNotification(notification.data);
  return notificationData
    ? {
        id: notification.id,
        data: notificationData,
        isRead: (notification.read_receipts?.length ?? 0) > 0,
        timestamp: notification.timestamp,
      }
    : undefined;
};
