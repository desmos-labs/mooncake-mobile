import React from 'react';
import {Platform} from 'react-native';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
import {useNavigation} from '@react-navigation/native';

const useStoragePermissions = () => {
  const {goBack} = useNavigation<any>();
  const [permissionsState, setPermissionsState] = React.useState<
    'granted' | 'rejected' | undefined
  >(undefined);

  const requestStoragePermissions = React.useCallback(async () => {
    const permission: any = Platform.select({
      android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.MEDIA_LIBRARY,
    });

    // @ts-ignore
    const grantedPermissions = await requestMultiple([permission]);

    // this will fail on ios simulator, so we skip permission check on emulators
    // https://github.com/zoontek/react-native-permissions/issues/498
    const isEmulator = await DeviceInfo.isEmulator();
    if (!isEmulator && grantedPermissions[permission] !== 'granted') {
      setPermissionsState('rejected');
      goBack();
    }
    setPermissionsState('granted');
  }, []);

  return {
    requestStoragePermissions,
    permissionsState,
  };
};

export default useStoragePermissions;
