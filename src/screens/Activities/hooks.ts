import React, { useCallback } from 'react';
import { CompleteNotification } from 'types/notifications';
import { useTranslation } from 'react-i18next';
import { getWeek } from 'date-fns';

/**
 * Hook that, given a list of {@link CompleteNotification}, splits them into two lists:
 * 1. the first one containing all the notifications that have timestamp within the current week
 * 2. the second one containing all the notifications that have timestamp older than the current week
 */
export const useSplitNotificationsByWeek = () => {
  const { t } = useTranslation();

  return React.useCallback(
    (notifications: CompleteNotification[]) => {
      const currentWeek = getWeek(new Date());
      const currentYear = new Date().getFullYear();

      const notificationsThisWeek: CompleteNotification[] = [];
      const notificationsOlderThanThisWeek: CompleteNotification[] = [];

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

/**
 * Function that is used to get the key for each item inside the list
 */
export const useKeyExtractor = () => {
  return useCallback((item: string | CompleteNotification, index: number) => {
    switch (typeof item) {
      case 'string':
        return `sectionHeader${index}`;
      default: {
        const { id, timestamp } = item as CompleteNotification;
        return `row${id}${timestamp}`;
      }
    }
  }, []);
};
