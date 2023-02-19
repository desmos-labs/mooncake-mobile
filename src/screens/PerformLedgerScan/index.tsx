import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import Typography from 'components/Typography';
import TopBar from 'components/TopBar';
import ThemedLottieView from 'components/ThemedLottieView';
import Button from 'components/Button';
import ROUTES from 'navigation/routes';
import { ConnectToLedgerStackParamList } from 'navigation/RootNavigator/ConnectToLedgerStack';
import useOnBackAction from 'hooks/navigation/useOnBackAction';
import { AppPermissions, AppPermissionStatus } from 'types/permissions';
import LedgerDeviceList from 'screens/PerformLedgerScan/components/LedgerDeviceList';
import usePermissions from 'hooks/permissions/usePermissions';
import DView from 'components/DView';
import { lookingForDevicesAnimation } from 'assets/animations';
import useStyles from './useStyles';
import { ScanErrorType, useBleScan, useRequestEnableBt } from './useHooks';

export type NavProps = StackScreenProps<ConnectToLedgerStackParamList, ROUTES.PERFORM_LEDGER_SCAN>;

/**
 * Screen that performs a bluetooth scan in order to find a Ledger device.
 */
const PerformLedgerScan = (props: NavProps) => {
  const styles = useStyles();
  const { t } = useTranslation('ledgerScan');

  const { route } = props;
  const { ledgerApp, onConnect, onCancel } = route.params;

  const [authorized, setAuthorized] = useState(false);
  const [doFirstScan, setDoFirstScan] = useState(true);

  const { scan, scanning, devices, scanError } = useBleScan();
  const requestEnableBt = useRequestEnableBt();
  const { checkPermission: checkBtPermissions, requestPermission: requestBluetoothPermissions } =
    usePermissions(AppPermissions.Bluetooth);

  useOnBackAction(() => {
    if (onCancel !== undefined) {
      onCancel();
    }
  }, [onCancel]);

  useEffect(() => {
    if (doFirstScan && authorized) {
      setDoFirstScan(false);
      scan().then(() => {});
    }
  }, [doFirstScan, authorized, scan]);

  useEffect(() => {
    (async () => {
      let checkResult = await checkBtPermissions();
      if (checkResult === AppPermissionStatus.Denied) {
        checkResult = await requestBluetoothPermissions();
      }

      setAuthorized(checkResult === AppPermissionStatus.Granted);
    })();

    // Fine to ignore since we need to check the permissions only the first time
    // we open this screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const errorMessage = useMemo(() => {
    if (!authorized) {
      return Platform.OS === 'ios' ? t('grant permissions ios') : t('grant permissions android');
    }

    if (scanError?.type === ScanErrorType.Unknown) {
      return scanError.message;
    }

    switch (scanError?.type) {
      case ScanErrorType.BtOff:
        return t('error bluetooth off');
      default:
        return undefined;
    }
  }, [authorized, scanError, t]);

  const actionButton = useMemo(() => {
    if (!authorized) {
      return (
        <Button
          mode="contained"
          onPress={async () => {
            const permissions = await requestBluetoothPermissions();
            if (permissions === AppPermissionStatus.Granted) {
              setAuthorized(true);
            }
          }}>
          {t('grant permissions')}
        </Button>
      );
    }

    if (scanError === undefined) {
      return (
        <Button mode="contained" loading={scanning} disabled={scanning} onPress={() => scan()}>
          {scanning ? t('looking for devices') : t('start scan')}
        </Button>
      );
    }

    switch (scanError.type) {
      case ScanErrorType.BtOff:
        return (
          <Button
            mode="contained"
            onPress={async () => {
              const result = await requestEnableBt();
              if (result) {
                await scan();
              }
            }}>
            {t('turn on bluetooth')}
          </Button>
        );
      default:
        return null;
    }
  }, [t, authorized, scanError, requestBluetoothPermissions, scanning, scan, requestEnableBt]);

  return (
    <DView topBar={<TopBar />} style={styles.root}>
      <ThemedLottieView
        style={styles.lookingForDevices}
        source={lookingForDevicesAnimation}
        loop
        autoSize
        autoPlay
        speed={scanning ? 1 : 0}
        progress={scanning ? undefined : 0}
      />
      <Typography.Subtitle1 style={styles.title}>{t('looking for devices')}</Typography.Subtitle1>

      <Typography.Body1 style={styles.advice}>
        <Trans
          t={t}
          i18nKey="nano x unlock bluetooth check"
          values={{
            app: ledgerApp.name,
          }}
          components={{
            bold: <Typography.Subtitle1 />,
          }}
        />
      </Typography.Body1>

      {errorMessage === undefined && authorized ? (
        <LedgerDeviceList ledgerApp={ledgerApp} devices={devices} onConnect={onConnect} />
      ) : (
        <Typography.Subtitle1 style={styles.noDeviceError}>{errorMessage}</Typography.Subtitle1>
      )}

      {actionButton}
    </DView>
  );
};

export default PerformLedgerScan;
