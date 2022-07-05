import React from 'react';
import {
  Alert,
  FlatList,
  Image,
  ListRenderItemInfo,
  Platform,
  View,
} from 'react-native';
import {btDevice, ledgerIcon} from 'assets/images';
import LedgerDeviceItem from 'components/LedgerDeviceItem';
import Spacer from 'components/Spacer';
import {useNavigation} from '@react-navigation/native';
import DView from 'components/DView';
import DButton from 'components/DButton';
import Typography from 'components/Typography';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'react-native-paper';
import useStartBleScan from 'hooks/ledger/useStartBleScan';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
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

  React.useEffect(() => {
    checkPermissions()
      .then(permissions => {
        if (permissions) return scan();
        else {
          Alert.alert(
            'Please grant permissions to pair your ledger device.',
            '',
            [
              {
                text: 'Go Back',
                onPress: () => {},
              },
            ],
          );
        }
      })
      .catch(err => {
        console.log(err);
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
            navigate('PairYourDevices', {
              deviceId: item.id,
              deviceName: item.name,
            });
          }}
        />
      );
    },
    [],
  );

  return (
    <DView>
      <View style={styles.graphicGroup}>
        <Image source={btDevice} style={styles.btDeviceImg} />
        <LoadingIndicator
          numDots={5}
          dotSize={8}
          hideActiveDots={!scanning}
          inactiveColor={theme.colors.surface}
          activeColor={theme.colors.primary}
        />
        <Image source={ledgerIcon} style={styles.ledgerImg} />
      </View>
      <DButton>
        <Typography.Body1 style={styles.headerStyle}>
          {t('header')}
        </Typography.Body1>
      </DButton>
      <Typography.Body1 style={styles.descriptionStyle}>
        {t('description')}
      </Typography.Body1>

      <FlatList
        style={styles.flatlistContainer}
        ItemSeparatorComponent={Spacer}
        data={devices}
        renderItem={renderItem}
      />

      {!scanning && (
        <>
          {devices.length === 0 && (
            <Typography.Subtitle style={styles.warningStyle}>
              {t('noDeviceFound')}
            </Typography.Subtitle>
          )}

          <View style={styles.buttonContainer}>
            <DButton onPress={onPressRetry}>
              <Typography.Subtitle>{t('common:retry')}</Typography.Subtitle>
            </DButton>
          </View>
        </>
      )}
    </DView>
  );
};

export default LookingForDevices;
