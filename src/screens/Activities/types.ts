import { NotificationData } from 'types/notifications';

export interface CompleteNotification {
  /**
   * Notification UUID
   */
  id?: string;
  /**
   * data object, containing notification fields
   */
  data: NotificationData;
  read_receipts: any[];
  /**
   * Profile of the notification author
   */
  profile?: any;

  /**
   * Complete post object
   */
  post?: any;
  /**
   * Notification timestamp
   */
  timestamp: string;
}
