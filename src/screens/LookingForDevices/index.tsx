import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {btDevice, ledgerIcon, noLedgerFound} from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import {DesmosLedgerApp} from 'config/LedgerApps';
import useStartBleScan from 'hooks/ledger/useStartBleScan';
import ROUTES from 'navigation/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  ListRenderItemInfo,
  Platform,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import {AuthorizeWalletParamList} from 'navigation/RootNavigator/AuthorizeWalletStack';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import LedgerDeviceItem from './components/LedgerDeviceItem';
import LoadingIndicator from './components/LoadingIndicator';
import useStyles from './useStyles';

// refactor into hook
const checkPermissions = async () => {
  const permissions = Platform.select({
    android: [
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    ],
    ios: [PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL],
  });

  const grantedPermissions = await requestMultiple(permissions!);

  const grantedPermissionCount = Object.values(grantedPermissions).filter(
    x => x === 'granted',
  ).length;

  return grantedPermissionCount === permissions!.length;
};

export type LookingForDevicesParams = {
  ledgerApp?: LedgerApp;

  autoClose?: boolean;

  onConnectionEstablished?: (transport: BluetoothTransport) => void;

  onCancel?: () => void;
};

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.LOOKING_FOR_DEVICES
>;

type AuthNavProps = StackScreenProps<
  AuthorizeWalletParamList,
  ROUTES.AUTH_LOOKING_FOR_DEVICES
>;

/**
 * Screen where users can search for Nano X devices via Bluetooth.
 */
const LookingForDevices = () => {
  const {navigate, replace} = useNavigation<any>();
  const {params} = useRoute<NavProps['route'] | AuthNavProps['route']>();
  const {t} = useTranslation('lookingForDevices');
  const styles = useStyles();

  const theme = useTheme();
  const {scan, scanning, devices} = useStartBleScan();

  const [screenReady, setScreenReady] = React.useState(false);
  const [isBTOn, setIsBTOn] = React.useState(false);

  const isFocused = useIsFocused();

  React.useEffect(() => {
    const checkEnabledAndPermissions = async () => {
      if (!isFocused) return;

      const state = await BluetoothStateManager.getState();

      if (state === 'PoweredOff') {
        handlePressEnableBT();
      } else {
        setIsBTOn(true);
      }
    };

    checkEnabledAndPermissions();
  }, [isFocused]);

  React.useEffect(() => {
    if (isBTOn) {
      checkPermissions()
        .then(permissions => {
          console.log(permissions);
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

  const onPressRetry = React.useCallback(() => {
    scan().then();
  }, []);

  const handlePressEnableBT = React.useCallback(async () => {
    // don't do anything if BT is already on
    if (isBTOn) return;

    if (Platform.OS === 'ios') {
      await Linking.openURL('App-Prefs:Bluetooth');
    } else {
      await BluetoothStateManager.openSettings();
    }
  }, [isBTOn]);

  const renderItem = React.useCallback(
    ({item}: ListRenderItemInfo<BleLedger>) => {
      return (
        <LedgerDeviceItem
          name={item.name || 'UNKNOWN LEDGER DEVICE'}
          onPress={async () => {
            if (params && params.autoClose) {
              replace(ROUTES.AUTH_CONNECT_TO_LEDGER, {
                bleLedger: {
                  id: item.id,
                  name: item.name,
                },
                ledgerApp: DesmosLedgerApp,
                ...params,
              });
            } else {
              navigate(ROUTES.CONNECT_TO_LEDGER, {
                bleLedger: {
                  id: item.id,
                  name: item.name,
                },
                ledgerApp: DesmosLedgerApp,
              });
            }
          }}
        />
      );
    },
    [params],
  );

  const screenContent = React.useMemo(() => {
    // Show a loading indicator instead of the "no devices found" screen on load

    if (!isBTOn) {
      return (
        <View style={styles.container}>
          <View style={styles.graphicGroup}>
            <Image source={noLedgerFound} style={styles.noDeviceImage} />
          </View>
          <Typography.H4 style={[styles.headerStyle, styles.noDevicesText]}>
            {t('btNotOn')}
          </Typography.H4>

          <Typography.Body6 style={styles.descriptionStyle}>
            {t('pleaseEnableBT')}
          </Typography.Body6>

          <Button
            mode="gradientFilled"
            containerStyle={styles.retryButton}
            onPress={handlePressEnableBT}>
            {t('enableBT')}
          </Button>
        </View>
      );
    }

    if (!screenReady) {
      return (
        <View style={styles.centeredContainer}>
          <ActivityIndicator />
        </View>
      );
    }

    if (!scanning && devices.length === 0) {
      return (
        <View style={styles.container}>
          <View style={styles.graphicGroup}>
            <Image source={noLedgerFound} style={styles.noDeviceImage} />
          </View>
          <Typography.H4 style={[styles.headerStyle, styles.noDevicesText]}>
            {t('noDeviceFound')}
          </Typography.H4>

          <Typography.Body6 style={styles.descriptionStyle}>
            {t('description')}
          </Typography.Body6>

          <Button
            mode="gradientFilled"
            containerStyle={styles.retryButton}
            onPress={onPressRetry}>
            {t('common:retry')}
          </Button>
        </View>
      );
    }

    return (
      <>
        <View style={styles.container}>
          <View style={styles.graphicGroup}>
            <Image source={btDevice} style={styles.btDeviceImg} />
            <LoadingIndicator
              numDots={5}
              dotSize={8}
              hideActiveDots={!scanning}
              inactiveColor={theme.colors.butterOrange03}
              activeColor={theme.colors.butterOrange03}
            />
            <Image source={ledgerIcon} style={styles.ledgerImg} />
          </View>
          <Typography.H4 style={styles.headerStyle}>
            {t('header')}
          </Typography.H4>
          <Typography.Body6 style={styles.descriptionStyle}>
            {t('description')}
          </Typography.Body6>
        </View>

        <FlatList
          style={styles.flatlistContainer}
          contentContainerStyle={styles.contentContainer}
          ItemSeparatorComponent={Spacer}
          data={devices}
          renderItem={renderItem}
        />
      </>
    );
  }, [scanning, devices.length, screenReady]);

  return <DView>{screenContent}</DView>;
};

export default LookingForDevices;
