import { firebase } from '@react-native-firebase/messaging';
import { promiseToResult } from 'lib/NeverThrowUtils';
import { err, ok } from 'neverthrow';
import React from 'react';
import RegistDeviceForNotifications from 'services/axios/requests/RegistDeviceForNotifications';

/**
 * Hook that provides a function to register the user's  device
 * for notifications.
 */
const useRegisterDeviceForNotifications = () => {
  return React.useCallback(async () => {
    const getDeviceTokenResult = await promiseToResult(
      firebase.messaging().getToken(),
      'Failed to get device token',
    );
    if (getDeviceTokenResult.isErr()) {
      return err(getDeviceTokenResult.error);
    }

    const deviceToken = getDeviceTokenResult.value;
    const regitrationResult = await RegistDeviceForNotifications(deviceToken);
    if (regitrationResult.isErr()) {
      return err(regitrationResult.error);
    }
    return ok(undefined);
  }, []);
};

export default useRegisterDeviceForNotifications;
