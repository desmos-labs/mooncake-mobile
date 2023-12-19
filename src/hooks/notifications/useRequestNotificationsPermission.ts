import { PermissionStatus } from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import useRegisterDeviceForNotifications from './useRegisterDeviceForNotifications';

/**
 * Hook that allows to ask the user permission to access the device notifications.
 * Once the permission is given, it is stored within the application settings so that
 * it can be later disabled by the user.
 */
const useRequestNotificationsPermission = () => {
  const registerDeviceForNotifications = useRegisterDeviceForNotifications();
  const { t } = useTranslation('permissions');

  const requestUserPermission = useCallback(async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== PermissionStatus.GRANTED) {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== PermissionStatus.GRANTED) {
      Alert.alert(t('you can change the permissions from the settings'));
      return;
    }
    // After we have the permission, we can register the device for notifications.
    await registerDeviceForNotifications();
  }, [registerDeviceForNotifications, t]);

  useEffect(() => {
    requestUserPermission();
    // Safe to ignore, we want to execute this function just one time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useRequestNotificationsPermission;
