import { SocialNotificationData } from 'types/notifications';
import notifee from '@notifee/react-native';

/**
 * Function that allows to create a local notification when the app is in background
 * @param data The notification data
 */
const createBackgroundNotificationData = async (data: SocialNotificationData) => {
  // TODO find a way to update the notifications count without using the recoil state hook because
  // is not possible to use the recoil state in a function that is not a react component
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
};

export default createBackgroundNotificationData;
