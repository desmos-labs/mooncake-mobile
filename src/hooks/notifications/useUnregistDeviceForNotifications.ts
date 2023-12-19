import { firebase } from '@react-native-firebase/messaging';
import { promiseToResult } from 'lib/NeverThrowUtils';
import { err, ok } from 'neverthrow';
import React from 'react';
import UnregistDeviceForNotifications from 'services/axios/requests/UnregistDeviceForNotifications';

/**
 * Hook that provides a function to unregister the user's device
 * for notifications.
 */
const useUnregistDeviceForNotifications = () => {
  return React.useCallback(async () => {
    const getDeviceTokenResult = await promiseToResult(
      firebase.messaging().getToken(),
      'Failed to get device token',
    );
    if (getDeviceTokenResult.isErr()) {
      return err(getDeviceTokenResult.error);
    }

    const deviceToken = getDeviceTokenResult.value;
    const unregistResult = await UnregistDeviceForNotifications(deviceToken);
    if (unregistResult.isErr()) {
      return err(unregistResult.error);
    }
    return ok(undefined);
  }, []);
};

export default useUnregistDeviceForNotifications;
