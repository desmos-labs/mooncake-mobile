import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { NotificationData } from 'types/notifications';

/**
 * Function to handle the notifications received in the background
 */
// Disable eslint since in the future we may want to add more
// functions.
// eslint-disable-next-line import/prefer-default-export
export const handleBackcroundNotifications = async (
  message: FirebaseMessagingTypes.RemoteMessage,
): Promise<void> => {
  console.log('[Background-Firebase]: RemoteMessage', message);
  console.log('[Background-Firebase]: Data', message.data as Partial<NotificationData>);
};
