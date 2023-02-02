import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { ExternalAccount, selectedExternalAccountState } from '@recoil/connectChainState';
import AddressItem from 'components/AddressItem';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import useActiveAccount from 'hooks/useActiveAccount';
import useCheckIsAddressLinked from 'hooks/useCheckIsAddressLinked';
import useGenerateAccounts from 'hooks/useGenerateAccounts';
import useGenerateProof from 'hooks/useGenerateProof';
import _ from 'lodash';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { BottomTabsParamList } from 'navigation/RootNavigator/BottomTabs';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSetRecoilState } from 'recoil';
import useStyles from '../useStyles';

export type NavProps = CompositeScreenProps<
  StackScreenProps<RootNavigatorParamList, ROUTES.CONNECT_ADDRESS_GENERAL>,
  BottomTabScreenProps<BottomTabsParamList>
>;

export type ConnectAddressGeneralParams = {
  nextRouteOverride?: keyof RootNavigatorParamList;
  loadedProfileMap?: Map<string, ProfileData>;
  titleLabelOverride?: string;

  ledgerTransport?: BluetoothTransport;
  ledgerApp?: LedgerApp;
};

const ConnectAddressGeneral = () => {
  const { activeAddress } = useActiveAccount();
  // placeholder
  const navigation = useNavigation<NavProps['navigation']>();

  const route = useRoute<NavProps['route']>();

  const { nextRouteOverride, loadedProfileMap, titleLabelOverride } = route?.params ?? {};

  const setSelectedExternalAccount = useSetRecoilState(selectedExternalAccountState);

  const { checkIsAddressLinked } = useCheckIsAddressLinked();

  const { generateProof } = useGenerateProof();

  const { t } = useTranslation('connectAddress');

  const styles = useStyles();

  const theme = useTheme();

  const ledgerTransport = _.get(route, 'params.ledgerTransport');
  const ledgerApp = _.get(route, 'params.ledgerApp');

  const isUsingLedger = !!(ledgerTransport && ledgerApp);

  const { accounts, generateAccounts, loading } = useGenerateAccounts();

  React.useEffect(() => {
    generateAccounts(isUsingLedger ? 5 : 10);
  }, []);

  const SwitchToAdvancedButton = React.useMemo(() => {
    return (
      <View style={styles.topBarButtonContainer}>
        <Button
          mode="text"
          onPress={async () => {
            if (ledgerTransport) {
              await (ledgerTransport as BluetoothTransport).close();
            }
            navigation.navigate(ROUTES.CONNECT_ADDRESS_ADVANCED, route.params);
          }}>
          <Typography.Button2 style={styles.modeButtonText}>{t('advanced')}</Typography.Button2>
        </Button>
      </View>
    );
  }, [navigation, nextRouteOverride, loadedProfileMap, titleLabelOverride]);

  const renderItem = React.useCallback(
    ({
      item,
      index,
    }: {
      // eslint-disable-next-line react/no-unused-prop-types
      item: ExternalAccount;
      // eslint-disable-next-line react/no-unused-prop-types
      index: number;
    }) => {
      if (!activeAddress) {
        return <ActivityIndicator color={theme.colors.surfaceBlack} />;
      }
      const handlePress = async () => {
        if (nextRouteOverride) {
          if (loadedProfileMap?.has(item.address)) {
            return navigation.navigate(ROUTES.BOTTOM_TABS, {
              screen: ROUTES.USER_PROFILE,
            });
          }

          // TODO: refactor and fix
          setSelectedExternalAccount(item);
          // @ts-ignore
          return navigation.navigate(nextRouteOverride);
        }

        const proof = await generateProof({
          externalAccount: item,
          activeAddress,
        });

        if (proof) {
          navigation.navigate(ROUTES.CONNECT_CHAIN_TX_DETAIL, {
            proof,
            externalAddress: item.address,
          });
        }
      };

      return (
        <AddressItem
          key={item.address}
          index={index}
          address={item.address}
          handlePress={handlePress}
          isAlreadyLinked={checkIsAddressLinked(item.address)}
        />
      );
    },
    [navigation, nextRouteOverride, loadedProfileMap, activeAddress],
  );

  const ItemSeparatorComponent = React.useCallback(
    () => <Spacer paddingVertical={theme.spacing.s} />,
    [],
  );

  const ListFooterComponent = React.useMemo(() => {
    if (loading) {
      return (
        <ActivityIndicator
          style={{ width: '100%', marginVertical: 16 }}
          color={theme.colors.surfaceBlack}
        />
      );
    } else return <View />;
  }, [loading]);

  return (
    <DView
      topBar={<TopBar rightElement={SwitchToAdvancedButton} />}
      backgroundColor={theme.colors.white}>
      <View style={styles.container}>
        <Typography.H3 style={styles.textStyle}>{titleLabelOverride || t('header')}</Typography.H3>
        <Spacer paddingTop={theme.spacing.m} paddingBottom={theme.spacing.s}>
          <Typography.Body6 style={styles.textStyle}>{t('selectAnAccount')}</Typography.Body6>
        </Spacer>
      </View>

      <FlatList
        data={accounts}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
        contentContainerStyle={{
          padding: theme.spacing.m,
        }}
        refreshing={loading}
        onEndReached={() => {
          !isUsingLedger && generateAccounts(10);
        }}
      />
      {ListFooterComponent}
    </DView>
  );
};

export default ConnectAddressGeneral;
