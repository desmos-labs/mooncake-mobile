import { useSetAppState } from '@recoil/appState';
import { PermissionResponse, PermissionStatus } from 'expo-image-picker';
import React from 'react';
import { AppState, Linking, Platform } from 'react-native';
import AppPermissionStatus from 'types/permissions';

/**
 * Utility function to convert a `PermissionResponse` from expo into a `AppPermissionStatus`.
 * @param response - The expo response to convert.
 */
const convertExpoResponse = (response: PermissionResponse): AppPermissionStatus => {
  if (response.granted) {
    return AppPermissionStatus.Granted;
  } else {
    return response.canAskAgain ? AppPermissionStatus.Denied : AppPermissionStatus.Blocked;
  }
};

/**
 * Function that opens the application settings to ask the user
 * to update the settings
 * @param permissionsCheck - Callback that checks the permissions status after
 * returning to the app from the settings screen.
 */
const openSettingsAndCheckPermissions = async (
  permissionsCheck: () => Promise<PermissionResponse>,
) => {
  // Prepare the promise that will check the settings after the application
  // come back to focus.
  const promise = new Promise<AppPermissionStatus>((resolve, reject) => {
    const subscription = AppState.addEventListener('change', async state => {
      if (state === 'active') {
        subscription.remove();
        permissionsCheck().then(convertExpoResponse).then(resolve).catch(reject);
      }
    });
  });

  // Open the settings
  if (Platform.OS === 'ios') {
    await Linking.openURL('app-settings:');
  } else {
    await Linking.openSettings();
  }

  return promise;
};

/**
 * Permissions request options.
 */
interface PermissionOptions {
  /**
   * Function to get the permission status.
   */
  getMethod: () => Promise<PermissionResponse>;
  /**
   * Function to request the permission.
   */
  requestMethod: () => Promise<PermissionResponse>;
  /**
   * True if the hook should check the permission status, false otherwise.
   * If this field is undefined will default to `true`.
   */
  get?: boolean;
  /**
   * True if the hook should request the permissions.
   * If this field is undefined will default to `true`.
   */
  request?: boolean;
}

/**
 * Hook that provides the status of a permission, a function to get the status of a permission
 * and a function to request the permission to the user.
 * @param options - Hook options.
 */
const useAppPermissions = (options: PermissionOptions) => {
  const { getMethod, requestMethod } = options;
  const setAppState = useSetAppState();
  const [permissionStatus, setPermissionStatus] = React.useState<AppPermissionStatus>();

  const requestPermission = React.useCallback(async () => {
    const currentPermissionStatus = await getMethod();
    // Check if we can request the permissions, or if the user already rejected
    // more than the allowed times.
    if (
      currentPermissionStatus.status === PermissionStatus.DENIED ||
      currentPermissionStatus.status === PermissionStatus.UNDETERMINED
    ) {
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

      const status = await requestMethod().then(convertExpoResponse);
      setPermissionStatus(status);
      if (status === AppPermissionStatus.Blocked) {
        // Already asked the user the permission to many times, open the settings.
        const statusAfterSettings = await openSettingsAndCheckPermissions(getMethod);
        setPermissionStatus(statusAfterSettings);
        return statusAfterSettings;
      }
      return status;
    }
    setPermissionStatus(convertExpoResponse(currentPermissionStatus));
    return convertExpoResponse(currentPermissionStatus);
  }, [getMethod, requestMethod, setAppState]);

  const checkPermission = React.useCallback(async () => {
    return getMethod().then(convertExpoResponse);
  }, [getMethod]);

  React.useEffect(() => {
    const getPermissions = options?.get ?? true;
    if (getPermissions) {
      checkPermission().then(setPermissionStatus);
    }
  }, [options?.get, checkPermission]);

  React.useEffect(() => {
    const requestPermissions = options?.request ?? true;
    const requestPermissionsFunction = async () => {
      const currentStatus = await checkPermission();
      // Perform the request only if the permission state is `Denied`
      // because if is `Blocked` means that the user should grant
      // the permission through the settings screen.
      if (currentStatus === AppPermissionStatus.Denied) {
        requestPermission();
      }
    };

    if (requestPermissions) {
      requestPermissionsFunction();
    }
  }, [checkPermission, options?.request, requestPermission]);

  return {
    permissionStatus,
    requestPermission,
    checkPermission,
  };
};

export default useAppPermissions;
