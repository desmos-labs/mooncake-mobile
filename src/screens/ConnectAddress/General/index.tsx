import Button from 'components/Button';
import React, {FC} from 'react';
import DView from 'components/DView';
import {useNavigation} from '@react-navigation/native';
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
};

const ConnectAddressGeneral: FC<NavProps> = ({route}) => {
  const {nextRouteOverride, loadedProfileMap, titleLabelOverride} =
    route?.params ?? {};
  // placeholder
  const navigation = useNavigation<NavProps['navigation']>();

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
  const {accounts, generateAccountsFromMnemonic} = useGenerateAccounts({
    mnemonic,
    prefix: selectedChain.prefix,
    coinType: selectedChain.hdPath.coinType,
  });

  React.useEffect(() => {
    generateAccountsFromMnemonic();
  }, []);

  const SwitchToAdvancedButton = React.useMemo(() => {
    return (
      <View style={styles.topBarButtonContainer}>
        <Button
          mode="text"
          onPress={() => {
            navigation.navigate(ROUTES.CONNECT_ADDRESS_ADVANCED, {
              nextRouteOverride,
              loadedProfileMap,
              titleLabelOverride,
            });
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
    <DView topBar={<TopBar rightElement={SwitchToAdvancedButton} />}>
      <View style={styles.container}>
        <Typography.H5 style={styles.textStyle}>
          {titleLabelOverride || t('header')}
        </Typography.H5>

        <Spacer paddingTop={theme.spacing.l} paddingBottom={theme.spacing.m}>
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
          paddingHorizontal: theme.spacing.m,
        }}
        onEndReached={() => {
          generateAccountsFromMnemonic();
        }}
      />
    </DView>
  );
};

export default ConnectAddressGeneral;
