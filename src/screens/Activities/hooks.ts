import { getWeek } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Notification } from 'types/notifications';

/**
 * Hook that, given a list of {@link Notification}, splits them into two lists:
 * 1. the first one containing all the notifications that have timestamp within the current week
 * 2. the second one containing all the notifications that have timestamp older than the current week
 */
const useSplitNotificationsByWeek = () => {
  const { t } = useTranslation('activities');

  return React.useCallback(
    (notifications: Notification[]) => {
      const currentWeek = getWeek(new Date());
      const currentYear = new Date().getFullYear();

      const notificationsThisWeek: Notification[] = [];
      const notificationsOlderThanThisWeek: Notification[] = [];

      notifications.forEach(notification => {
        const notificationDate = new Date(notification.timestamp);
        const notificationWeek = getWeek(notificationDate);
        const notificationYear = notificationDate.getFullYear();

        if (notificationWeek === currentWeek && notificationYear === currentYear) {
          notificationsThisWeek.push(notification);
        } else {
          notificationsOlderThanThisWeek.push(notification);
        }
      });

      // Return an array that contains:
      // - a header telling the user that the following notifications are from the current week, if there any notifications from the current week
      // - the notifications from the current week
      // - separator, if there are both notifications from the current week and notifications older than the current week
      // - a header telling the user that the following notifications are older than the current week, if there any notifications older than the current week
      // - the notifications older than the current week
      return [
        ...(notificationsThisWeek.length > 0 ? [t('this week'), ...notificationsThisWeek] : []),
        ...(notificationsThisWeek.length > 0 && notificationsOlderThanThisWeek.length > 0
          ? ['divider']
          : []),
        ...(notificationsOlderThanThisWeek.length > 0
          ? [t('earlier'), ...notificationsOlderThanThisWeek]
          : []),
      ];
    },
    [t],
  );
};

export default useSplitNotificationsByWeek;
