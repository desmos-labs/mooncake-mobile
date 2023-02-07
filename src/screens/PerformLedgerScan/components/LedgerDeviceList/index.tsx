import React, { FC, useCallback } from 'react';
import { BLELedger, LedgerApp } from 'types/ledger';
import { FlatList, ListRenderItemInfo, TouchableOpacity } from 'react-native';
import Typography from 'components/Typography';
import ROUTES from 'navigation/routes';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ConnectToLedgerStackParamList } from 'navigation/RootNavigator/ConnectToLedgerStack';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import useStyles from './useStyles';

export interface LedgerDeviceListProps {
  ledgerApp: LedgerApp;
  devices: BLELedger[];
  onConnect: (transport: BluetoothTransport) => any;
}

const LedgerDeviceList: FC<LedgerDeviceListProps> = ({ devices, ledgerApp, onConnect }) => {
  const styles = useStyles();
  const navigation = useNavigation<StackNavigationProp<ConnectToLedgerStackParamList>>();

  const onLedgerItemSelected = useCallback(
    ({ item }: ListRenderItemInfo<BLELedger>) => {
      navigation.navigate({
        name: ROUTES.CONNECT_TO_LEDGER,
        params: {
          bleLedger: item,
          ledgerApp,
          onConnect,
        },
      });
    },
    [navigation, ledgerApp, onConnect],
  );

  const renderLedgerDevice = useCallback(
    (info: ListRenderItemInfo<BLELedger>) => (
      <TouchableOpacity style={styles.ledgerListItem} onPress={() => onLedgerItemSelected(info)}>
        <Typography.Body3 style={styles.ledgerName}>{info.item.name}</Typography.Body3>
      </TouchableOpacity>
    ),
    [onLedgerItemSelected, styles.ledgerListItem, styles.ledgerName],
  );

  return (
    <FlatList
      style={styles.deviceList}
      data={devices}
      renderItem={renderLedgerDevice}
      keyExtractor={item => item.id}
    />
  );
};

export default LedgerDeviceList;
