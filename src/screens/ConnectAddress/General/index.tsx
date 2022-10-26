import Button from 'components/Button';
import React from 'react';
import DView from 'components/DView';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Typography from 'components/Typography';
import TopBar from 'components/TopBar';
import Spacer from 'components/Spacer';
import {useTheme} from 'react-native-paper';
import {FlatList, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {
  connectChainState,
  selectedExternalAccountState,
} from '@recoil/connectChainState';
import LocalWallet from 'lib/LocalWallet';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import {ledgerApps} from 'config/LedgerApps';
import _ from 'lodash';
import useGenerateAccounts from './useGenerateAccounts';
import AddressItem from './components/AddressItem';
import useStyles from '../useStyles';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.CONNECT_ADDRESS_GENERAL
>;

export type ConnectAddressGeneralParams = {
  nextRouteOverride?: keyof RootNavigatorParamList;
  loadedProfileMap?: Map<string, ProfileData>;
  titleLabelOverride?: string;

  ledgerTransport?: BluetoothTransport;
  ledgerApp?: LedgerApp;
};

const ConnectAddressGeneral = () => {
  // placeholder
  const navigation = useNavigation<NavProps['navigation']>();

  const route = useRoute<NavProps['route']>();

  const {nextRouteOverride, loadedProfileMap, titleLabelOverride} =
    route?.params ?? {};

  const ledgerTransport = _.get(route, 'params.ledgerTransport');
  const ledgerApp = _.get(route, 'params.ledgerApp');

  const {mnemonic, selectedChain} = useRecoilValue(connectChainState);

  const setSelectedExternalAccount = useSetRecoilState(
    selectedExternalAccountState,
  );

  const {t} = useTranslation('connectAddress');

  const styles = useStyles();

  const theme = useTheme();

  /**
   * for integration, replace mnemonic with the user's stored mnemonic, and
   * prefix with the correct prefix of the account to be connected
   */
  const {accounts, generateAccountsFromMnemonic, generateAccountsFromLedger} =
    useGenerateAccounts({
      prefix: selectedChain.prefix,
      coinType: selectedChain.hdPath.coinType,
    });

  const generateNewAccounts = React.useCallback(() => {
    if (ledgerApps) {
      console.log('generate');
      try {
        generateAccountsFromLedger({
          transport: ledgerTransport,
          ledgerApp,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      generateAccountsFromMnemonic({mnemonic});
    }
  }, [
    generateAccountsFromLedger,
    generateAccountsFromMnemonic,
    ledgerTransport,
    mnemonic,
    ledgerApp,
  ]);

  React.useEffect(() => {
    generateNewAccounts();
  }, []);

  const SwitchToAdvancedButton = React.useMemo(() => {
    return (
      <View style={styles.topBarButtonContainer}>
        <Button
          mode="text"
          onPress={() => {
            navigation.navigate(ROUTES.CONNECT_ADDRESS_ADVANCED, route.params);
          }}>
          <Typography.Button2 style={styles.modeButtonText}>
            {t('advanced')}
          </Typography.Button2>
        </Button>
      </View>
    );
  }, [navigation, nextRouteOverride, loadedProfileMap, titleLabelOverride]);

  const renderItem = React.useCallback(
    // eslint-disable-next-line react/no-unused-prop-types
    ({item, index}: {item: LocalWallet; index: number}) => {
      return (
        <AddressItem
          key={item.bech32Address}
          index={index}
          address={item.bech32Address}
          handlePress={() => {
            if (nextRouteOverride) {
              if (loadedProfileMap?.has(item.bech32Address)) {
                return navigation.navigate(ROUTES.USER_PROFILE, {
                  visitingProfileAddress: item.bech32Address,
                });
              }

              setSelectedExternalAccount(item.serialize());
              return navigation.navigate(nextRouteOverride);
            }

            setSelectedExternalAccount(item.serialize());
            navigation.navigate(ROUTES.CONNECT_CHAIN_TX_DETAIL);
          }}
        />
      );
    },
    [navigation, nextRouteOverride, loadedProfileMap],
  );

  const ItemSeparatorComponent = React.useCallback(
    () => <Spacer paddingVertical={theme.spacing.s} />,
    [],
  );

  return (
    <DView
      topBar={<TopBar rightElement={SwitchToAdvancedButton} />}
      backgroundColor={theme.colors.white}>
      <View style={styles.container}>
        <Typography.H3 style={styles.textStyle}>
          {titleLabelOverride || t('header')}
        </Typography.H3>
        <Spacer paddingTop={theme.spacing.m} paddingBottom={theme.spacing.s}>
          <Typography.Body6 style={styles.textStyle}>
            {t('selectAnAccount')}
          </Typography.Body6>
        </Spacer>
      </View>

      <FlatList
        data={accounts}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
        contentContainerStyle={{
          padding: theme.spacing.m,
        }}
        onEndReached={() => {
          generateNewAccounts();
        }}
      />
    </DView>
  );
};

export default ConnectAddressGeneral;
