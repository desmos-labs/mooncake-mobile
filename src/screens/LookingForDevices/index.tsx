import {useNavigation, useRoute} from '@react-navigation/native';
import {btDevice, ledgerIcon, noLedgerFound} from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import {DesmosLedgerApp} from 'config/LedgerApps';
import ROUTES from 'navigation/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItemInfo,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import {AuthorizeWalletParamList} from 'navigation/RootNavigator/AuthorizeWalletStack';
import LedgerDeviceItem from './components/LedgerDeviceItem';
import LoadingIndicator from './components/LoadingIndicator';
import useHooks from './useHooks';
import useStyles from './useStyles';

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

  const {
    isBTOn,
    screenReady,
    scanning,
    devices,
    handlePressEnableBT,
    onPressRetry,
  } = useHooks();

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
  }, [scanning, devices.length, screenReady, isBTOn]);

  return <DView>{screenContent}</DView>;
};

export default LookingForDevices;
