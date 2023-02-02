import React from 'react';
import { Platform } from 'react-native';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
import { useNavigation } from '@react-navigation/native';

type PermissionsStateType = 'granted' | 'rejected' | undefined;

/**
 * @typedef ReturnType
 * @property {Promise<void>} requestStoragePermissions - A callback that requests required permissions for react-native-camera-roll
 * @property {PermissionsStateType} permissionsState - The state of the permissions.
 */
type ReturnType = {
  requestStoragePermissions: (goBackOnFail?: boolean) => Promise<void>;

  permissionsState: PermissionsStateType;
};

/**
 * A hook that requests permissions necessary for react-native-cameral-roll to work
 * @returns {ReturnType}
 */
const useStoragePermissions = (): ReturnType => {
  const { goBack } = useNavigation<any>();
  const [permissionsState, setPermissionsState] = React.useState<PermissionsStateType>(undefined);

  const requestStoragePermissions = React.useCallback(async (goBackOnFail?: boolean) => {
    const permission: any = Platform.select({
      android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    });

    // @ts-ignore
    const grantedPermissions = await requestMultiple([permission]);

    // this will fail on ios simulator, so we skip permission check on emulators
    // https://github.com/zoontek/react-native-permissions/issues/498
    const isEmulator = await DeviceInfo.isEmulator();
    console.log(grantedPermissions[permission]);
    if (
      isEmulator ||
      grantedPermissions[permission] === 'granted' ||
      grantedPermissions[permission] === 'limited'
    ) {
      return setPermissionsState('granted');
    }

    setPermissionsState('rejected');
    goBackOnFail && goBack();
  }, []);

  return {
    requestStoragePermissions,
    permissionsState,
  };
};

export default useStoragePermissions;
