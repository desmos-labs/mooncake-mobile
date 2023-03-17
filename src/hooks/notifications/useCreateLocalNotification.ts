import React from 'react';
import { SocialNotificationData } from 'types/notifications';
import notifee from '@notifee/react-native';
import { useSetAppStateValue } from '@recoil/appState';

const useCreateLocalNotification = () => {
  const setNotificationsCount = useSetAppStateValue('notificationsCount');

  return React.useCallback(
    async (data: SocialNotificationData) => {
      setNotificationsCount(count => count + 1);

      const actualBadgeCount = await notifee.getBadgeCount();
      await notifee.setBadgeCount(actualBadgeCount + 1);

      // TODO create more channels based on the notification type
      // Create the notification channel id
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        sound: 'default',
        vibration: true,
        lights: true,
        badge: true,
      });

      // Display the notification
      await notifee.displayNotification({
        title: data.title,
        body: data.body,
        android: {
          channelId,
          smallIcon: 'ic_small_icon',
          color: '#fcce28',
          pressAction: {
            id: 'default',
          },
        },
        data: JSON.parse(JSON.stringify(data)),
        ios: {
          interruptionLevel: 'active',
          sound: 'default',
        },
      });
    },
    [setNotificationsCount],
  );
};

export default useCreateLocalNotification;
