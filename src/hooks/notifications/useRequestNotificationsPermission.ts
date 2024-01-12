import { PermissionStatus } from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { IosAuthorizationStatus } from 'expo-notifications';
import sleep from 'lib/sleep';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Platform } from 'react-native';
import useRegisterDeviceForNotifications from './useRegisterDeviceForNotifications';

/**
 * Hook that allows to ask the user permission to access the device notifications.
 * Once the permission is given, it is stored within the application settings so that
 * it can be later disabled by the user.
 */
const useRequestNotificationsPermission = () => {
  const registerDeviceForNotifications = useRegisterDeviceForNotifications();
  const { t } = useTranslation('permissions');

  return useCallback(async () => {
    const { status: existingStatus, ios: existingIos } = await Notifications.getPermissionsAsync();
    // Only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (Platform.OS === 'ios') {
      let finalStatus = existingIos?.status;
      if (existingIos && existingIos.status !== IosAuthorizationStatus.AUTHORIZED) {
        const { ios } = await Notifications.requestPermissionsAsync();
        // On iOS, the permission is not granted immediately, so we need to wait for it.
        await sleep(1000);
        if (ios && ios.status) {
          finalStatus = ios?.status;
        }
      }
      if (finalStatus !== IosAuthorizationStatus.AUTHORIZED) {
        Alert.alert(t('you can change the permissions from the settings'));
        return;
      }
    } else {
      let finalStatus = existingStatus;
      if (existingStatus !== PermissionStatus.GRANTED) {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== PermissionStatus.GRANTED) {
        Alert.alert(t('you can change the permissions from the settings'));
        return;
      }
    }

    // Now we can register the device for notifications.
    // NOTE: the registration is done even if the user has already given the permission or refused to give it.
    // This is because the user can change the permission from the settings and we want to be able to send notifications
    await registerDeviceForNotifications();
  }, [registerDeviceForNotifications, t]);
};

export default useRequestNotificationsPermission;
