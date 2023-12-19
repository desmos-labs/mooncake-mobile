import notifee from '@notifee/react-native';
import { useCallback, useEffect } from 'react';
import useRegisterDeviceForNotifications from './useRegisterDeviceForNotifications';

/**
 * Hook that allows to ask the user permission to access the device notifications.
 * Once the permission is given, it is stored within the application settings so that
 * it can be later disabled by the user.
 */
const useRequestNotificationsPermission = () => {
  const registerDeviceForNotifications = useRegisterDeviceForNotifications();
  const requestUserPermission = useCallback(async () => {
    try {
      await notifee.requestPermission({
        sound: true,
        alert: true,
        badge: true,
        carPlay: true,
      });

      // After we have the permission, we can register the device for notifications.
      await registerDeviceForNotifications();
    } catch (e) {
      console.error(e);
    }
  }, [registerDeviceForNotifications]);

  useEffect(() => {
    requestUserPermission();
    // Safe to ignore, we want to execute this function just one time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useRequestNotificationsPermission;
