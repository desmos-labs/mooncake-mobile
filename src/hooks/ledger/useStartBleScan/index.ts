import TransportBLE from '@ledgerhq/react-native-hw-transport-ble';
import {useCallback, useEffect, useState} from 'react';
import {Linking, Platform} from 'react-native';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';

export enum ScanErrorCause {
  PoweredOff,
  Unauthorized,
  Unknown,
}

export type ScanError = {
  cause: ScanErrorCause;
  message: string;
};

export default function useStartBleScan() {
  const [subscription, setScanSubscription] = useState<
    Subscription | undefined
  >(undefined);
  const [stopScanTimeout, setStopStopScanTimeout] = useState<
    NodeJS.Timeout | undefined
  >(undefined);
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState<BleLedger[]>([]);

  // Clear the subscription when leaving the screen or when staring a new scan.
  useEffect(
    () => () => {
      if (subscription !== undefined) {
        subscription.unsubscribe();
      }
    },
    [subscription],
  );

  // Clear the scan timeout
  useEffect(
    () => () => {
      if (stopScanTimeout !== undefined) {
        clearTimeout(stopScanTimeout);
      }
    },
    [stopScanTimeout],
  );

  const stopScan = useCallback(() => {
    setScanning(false);
    setScanSubscription(undefined);
  }, []);

  // The error handling portion of this callback can be simplified
  const scan = useCallback(
    async (durationMs = 10000) => {
      const state = await BluetoothStateManager.getState();

      if (state === 'PoweredOff') {
        if (Platform.OS === 'ios') {
          await Linking.openURL('App-Prefs:Bluetooth');
        } else {
          await BluetoothStateManager.openSettings();
        }
      } else {
        setScanning(true);
        setScanSubscription(
          TransportBLE.listen({
            complete: () => {
              setScanning(false);
            },
            next: (e: any) => {
              if (e.type === 'add') {
                const {id, name} = e.descriptor;

                setDevices(currentDevices => {
                  const devicePresent =
                    currentDevices.find(d => d.id === id) !== undefined;
                  if (!devicePresent) {
                    return [
                      ...currentDevices,
                      {
                        id,
                        name,
                      },
                    ];
                  }
                  return currentDevices;
                });
              }
            },
            error: err => {
              console.log('scanning err:', err);
              setScanning(false);
            },
          }),
        );
        setStopStopScanTimeout(
          setTimeout(() => {
            stopScan();
          }, durationMs),
        );
      }
    },
    [stopScan],
  );

  return {
    scan,
    scanning,
    devices,
  };
}
