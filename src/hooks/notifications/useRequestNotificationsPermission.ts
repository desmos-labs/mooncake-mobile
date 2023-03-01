import notifee, { AuthorizationStatus } from '@notifee/react-native';
import { useSetSetting } from '@recoil/settings';
import { useCallback, useEffect } from 'react';

/**
 * Hook that allows to ask the user permission to access the device notifications.
 * Once the permission is given, it is stored within the application settings so that
 * it can be later disabled by the user.
 */
const useRequestNotificationsPermission = () => {
  const setNotificationPermission = useSetSetting('notificationsPermission');

  const requestUserPermission = useCallback(async () => {
    try {
      const notifeeAuth = await notifee.requestPermission({
        sound: true,
        alert: true,
        badge: true,
        carPlay: true,
      });

      switch (notifeeAuth.authorizationStatus) {
        case AuthorizationStatus.AUTHORIZED:
          setNotificationPermission(true);
          break;
        default:
          setNotificationPermission(false);
      }
    } catch (e) {
      console.error(e);
    }
  }, [setNotificationPermission]);

  useEffect(() => {
    requestUserPermission().then(() => console.log('Permissions requested'));

    // Safe to ignore, we want to execute this function just one time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useRequestNotificationsPermission;
