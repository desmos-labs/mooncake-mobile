import React from 'react';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import {Alert, Linking, Platform} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import useStartBleScan from 'hooks/ledger/useStartBleScan';
import {useTranslation} from 'react-i18next';
import useInterval from 'hooks/useInterval';

const checkPermissions = async () => {
  const permissions = () => {
    if (Platform.OS === 'android') {
      if (parseInt(Platform.constants.Release, 10) > 11) {
        return [
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
          PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        ];
      } else {
        return [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];
      }
    } else {
      return [PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL];
    }
  };

  const grantedPermissions = await requestMultiple(permissions());

  const grantedPermissionCount = Object.values(grantedPermissions).filter(
    x => x === 'granted',
  ).length;

  return grantedPermissionCount === permissions!.length;
};

const useHooks = () => {
  const {t} = useTranslation('lookingForDevices');
  const {scan, scanning, devices} = useStartBleScan();

  const [screenReady, setScreenReady] = React.useState(false);
  const [isBTOn, setIsBTOn] = React.useState(false);

  const isFocused = useIsFocused();
  useInterval(async () => {
    if (!isFocused) return;
    const state = await BluetoothStateManager.getState();

    if (state === 'PoweredOff') {
      setIsBTOn(false);
    } else {
      setIsBTOn(true);
    }
  }, 2000);

  React.useEffect(() => {
    if (isBTOn) {
      checkPermissions()
        .then(permissions => {
          if (permissions) return scan();
          else {
            Alert.alert(t('permissionsDialog'), '', [
              {
                text: 'Go Back',
                onPress: () => {},
              },
            ]);
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          setScreenReady(true);
        });
    }
  }, [isBTOn]);

  const handlePressEnableBT = React.useCallback(async () => {
    // don't do anything if BT is already on
    if (isBTOn) return;

    if (Platform.OS === 'ios') {
      await Linking.openURL('App-Prefs:Bluetooth');
    } else {
      await BluetoothStateManager.openSettings();
    }
  }, [isBTOn]);

  const onPressRetry = React.useCallback(() => {
    scan().then();
  }, []);

  return {
    isBTOn,
    screenReady,
    scanning,
    devices,
    onPressRetry,
    handlePressEnableBT,
  };
};

export default useHooks;
