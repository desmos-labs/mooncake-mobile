/**
 * Type of notifications supported by the application.
 */
export enum NotificationType {
  // Dummy type to be removed once we have some valid type.
  Dummy = 'dummy',
}

// TODO: remove the eslint rule once we have some descendant types.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface BaseNotificationData {
  readonly type: NotificationType;
  readonly notification_id: string;
}

export type NotificationData = {};
