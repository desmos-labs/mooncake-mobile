import { AppPermissions, AppPermissionStatus } from 'types/permissions';
import React from 'react';
import { AppState, Platform } from 'react-native';
import * as Permissions from 'react-native-permissions';
import { PERMISSIONS } from 'react-native-permissions';
import {
  usePermissionsRequestCount,
  useSetPermissionsRequestCount,
} from '@recoil/permissionsRequestCount';
import { useSetAppState } from '@recoil/appState';
import DeviceInfo from 'react-native-device-info';

const isMultipleRejected = (permissions: Record<any, Permissions.PermissionStatus>): boolean =>
  Object.entries(permissions).find(([permission, permissionResult]) => {
    // IOS.PHOTO_LIBRARY will fail on ios simulator, so we skip permission check on emulators
    // https://github.com/zoontek/react-native-permissions/issues/498
    if (
      DeviceInfo.isEmulatorSync() &&
      Platform.OS === 'ios' &&
      permission === PERMISSIONS.IOS.PHOTO_LIBRARY
    ) {
      return false;
    }

    return permissionResult === 'denied' || permissionResult === 'blocked';
  }) !== undefined;

/**
 * Function that opens the application settings to ask the user
 * to update the settings
 * @param permissionsCheck - Callback that checks the permissions status after
 * returning to the app from the settings screen.
 */
const openSettingsAndCheckPermissions = async (
  permissionsCheck: () => Promise<AppPermissionStatus>,
) => {
  // Prepare the promise that will check the settings after the application
  // come back to focus.
  const promise = new Promise<AppPermissionStatus>((resolve, reject) => {
    const subscription = AppState.addEventListener('change', async state => {
      if (state === 'active') {
        // Unsubscribe from the event listener when the app is in focus.
        subscription.remove();
        // Resolve the promise with the result of the provided permissions check function.
        permissionsCheck().then(resolve).catch(reject);
      }
    });
  });

  // Open the settings
  await Permissions.openSettings();

  return promise;
};

const usePermissions = (permission: AppPermissions) => {
  const requestsCount = usePermissionsRequestCount();
  const setRequestsCount = useSetPermissionsRequestCount();
  const setAppState = useSetAppState();

  // List of permissions that we should request.
  const permissionsList = React.useMemo(() => {
    switch (permission) {
      case AppPermissions.Camera:
        return Platform.select({
          ios: [PERMISSIONS.IOS.CAMERA],
          android: [PERMISSIONS.ANDROID.CAMERA],
        })!;
      case AppPermissions.Bluetooth:
        return Platform.select({
          ios: [Permissions.PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL],
          android: [
            Permissions.PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
            Permissions.PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
            Permissions.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          ],
        })!;
      case AppPermissions.Storage:
        return Platform.select({
          android: [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE],
          ios: [PERMISSIONS.IOS.PHOTO_LIBRARY],
        })!;

      default:
        throw new Error(`unsupported permission ${permission}`);
    }
  }, [permission]);

  // Number of time that we can ask the user the permissions before
  // the os tell us that the permissions are not granted without prompting
  // the permissions request to the user.
  const maxAllowedRequests = React.useMemo(
    () =>
      Platform.select({
        ios: 1,
        android: 2,
      })!,
    [],
  );

  // Function to perform the permission request.
  const requestPermission = React.useCallback(async () => {
    const updatedCount = {
      ...requestsCount,
      [permission]: (requestsCount[permission] ?? 0) + 1,
    };

    if ((updatedCount[permission] ?? 0) <= maxAllowedRequests) {
      // Don't lock the app when displaying the permission popup.
      if (Platform.OS === 'ios') {
        setAppState(currentState => ({ ...currentState, noSplashScreen: true }));
      } else {
        setAppState(currentState => ({
          ...currentState,
          noLockOnBackground: true,
          noSplashScreen: true,
        }));
      }

      const permissionsRejected = await Permissions.requestMultiple(permissionsList).then(
        isMultipleRejected,
      );
      if (permissionsRejected) {
        setRequestsCount(updatedCount);
      }
      return permissionsRejected ? AppPermissionStatus.Denied : AppPermissionStatus.Granted;
    }

    // Already asked the user the permission to many times, open the settings.
    return openSettingsAndCheckPermissions(async () => {
      const rejected = await Permissions.requestMultiple(permissionsList).then(isMultipleRejected);
      return rejected ? AppPermissionStatus.Blocked : AppPermissionStatus.Granted;
    });
  }, [
    requestsCount,
    permission,
    maxAllowedRequests,
    setAppState,
    permissionsList,
    setRequestsCount,
  ]);

  // Function to check if the permissions have been granted.
  const checkPermission = React.useCallback(async () => {
    const permissionsDenied = await Permissions.checkMultiple(permissionsList).then(
      isMultipleRejected,
    );
    const requestCount = requestsCount[permission] ?? 0;

    if (permissionsDenied) {
      return requestCount >= maxAllowedRequests
        ? AppPermissionStatus.Blocked
        : AppPermissionStatus.Denied;
    }
    return AppPermissionStatus.Granted;
  }, [maxAllowedRequests, permission, permissionsList, requestsCount]);

  return {
    requestPermission,
    checkPermission,
  };
};

export default usePermissions;
