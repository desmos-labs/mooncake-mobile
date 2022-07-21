import {useNavigation} from '@react-navigation/native';
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
  ListRenderItemInfo,
  Platform,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import LedgerDeviceItem from './components/LedgerDeviceItem';
import LoadingIndicator from './components/LoadingIndicator';
import useStyles from './useStyles';

const checkPermissions = async () => {
  const permission = Platform.select({
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ios: PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
  });

  // @ts-ignore
  const grantedPermissions = await requestMultiple([permission]);

  // @ts-ignore
  return grantedPermissions[permission] === 'granted';
};

/**
 * Screen where users can search for Nano X devices via Bluetooth.
 */
const LookingForDevices = () => {
  const {navigate} = useNavigation<any>();
  const {t} = useTranslation('lookingForDevices');
  const styles = useStyles();

  const theme = useTheme();
  const {scan, scanning, devices} = useStartBleScan();

  const [screenReady, setScreenReady] = React.useState(false);

  React.useLayoutEffect(() => {
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
  }, []);

  const onPressRetry = React.useCallback(() => {
    scan().then();
  }, []);

  const renderItem = React.useCallback(
    ({item}: ListRenderItemInfo<BleLedger>) => {
      return (
        <LedgerDeviceItem
          name={item.name || 'UNKNOWN LEDGER DEVICE'}
          onPress={async () => {
            navigate(ROUTES.CONNECT_TO_LEDGER, {
              bleLedger: {
                id: item.id,
                name: item.name,
              },
              ledgerApp: DesmosLedgerApp,
            });
          }}
        />
      );
    },
    [],
  );

  const screenContent = React.useMemo(() => {
    // Show a loading indicator instead of the "no devices found" screen on load
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
              inactiveColor={theme.colors.desmosOrange03}
              activeColor={theme.colors.desmosOrange01}
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
