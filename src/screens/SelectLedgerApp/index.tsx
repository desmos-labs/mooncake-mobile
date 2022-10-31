import React from 'react';
import DView from 'components/DView';
import {FlatList, ListRenderItemInfo, View} from 'react-native';
import {useRecoilValue} from 'recoil';
import {selectedChainState} from '@recoil/connectChainState';
import Spacer from 'components/Spacer';
import {useTheme} from 'react-native-paper';
import ChainItem from 'screens/SelectChainConnection/components/ChainItem';
import ROUTES from 'navigation/routes';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import {useTranslation} from 'react-i18next';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.SELECT_LEDGER_APP
>;

/**
 * A screen where users select a ledger app to connect chains with more than one
 * supported ledger app
 */
const SelectLedgerApp = () => {
  const selectedChain = useRecoilValue(selectedChainState);
  const theme = useTheme();
  const {navigate} = useNavigation<NavProps['navigation']>();
  const {t} = useTranslation('selectLedgerApp');

  const renderItem = ({item}: ListRenderItemInfo<LedgerApp>) => {
    const handlePress = () => {
      navigate(ROUTES.AUTHORIZE_WALLET, {
        screen: ROUTES.AUTH_LOOKING_FOR_DEVICES,
        params: {
          ledgerApp: selectedChain.ledgerApps[0],
          autoClose: true,
          onConnectionEstablished: transport => {
            navigate(ROUTES.CONNECT_ADDRESS_ADVANCED, {
              ledgerApp: item,
              ledgerTransport: transport,
            });
          },
        },
      });
    };
    return (
      <ChainItem
        chainName=""
        symbol={item.name}
        icon={item.icon}
        handlePress={handlePress}
      />
    );
  };

  const ItemSeparatorComponent = React.useCallback(() => {
    return <Spacer paddingVertical={theme.spacing.s} />;
  }, []);

  return (
    <DView topBar={<TopBar />}>
      <View style={{paddingHorizontal: theme.spacing.m}}>
        <Typography.H3
          style={{
            color: theme.colors.surfaceBlack,
            marginBottom: theme.spacing.m,
          }}>
          {t('selectApp')}
        </Typography.H3>

        <Typography.Body6
          style={{
            color: theme.colors.surfaceBlack,
            marginBottom: theme.spacing.m,
          }}>
          {t('description')}
        </Typography.Body6>
      </View>
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.m,
        }}
        data={selectedChain.ledgerApps}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
    </DView>
  );
};

export default SelectLedgerApp;
