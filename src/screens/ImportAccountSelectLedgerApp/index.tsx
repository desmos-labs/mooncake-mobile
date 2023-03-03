import React from 'react';
import DView from 'components/DView';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { useRecoilValue } from 'recoil';
import Spacer from 'components/Spacer';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { LedgerApp } from 'types/ledger';
import importAccountAppState from '@recoil/screens/importAccountState';
import { CryptoDotOrgChain, DesmosChain } from 'config/LinkableChains';
import { CosmosLedgerApp, CryptoOrgLedgerApp, DesmosLedgerApp } from 'config/LedgerApps';
import useConnectToLedger from 'hooks/ledger/useConnectToLedger';
import useSelectAccount from 'hooks/accounts/useSelectAccount';
import { WalletPickerMode } from 'screens/ImportAccountSelectAccount/components/AccountPicker/types';
import LedgerAppItem from './components/LedgerAppItem';

/**
 * A screen where users select a ledger app to connect chains with more than one
 * supported ledger app
 */
const ImportAccountSelectLedgerApp = () => {
  const { ignoreAddresses, selectedChain, onSuccess } = useRecoilValue(importAccountAppState)!;
  const theme = useTheme();
  const { t } = useTranslation('selectLedgerApp');
  const connectToLedger = useConnectToLedger();
  const selectAccount = useSelectAccount();

  const ledgerApplications = React.useMemo(() => {
    if (selectedChain!.name === CryptoDotOrgChain.name) {
      return [CryptoOrgLedgerApp, CosmosLedgerApp];
    }
    if (selectedChain!.name === DesmosChain.name) {
      return [DesmosLedgerApp, CosmosLedgerApp];
    }
    return [CosmosLedgerApp];
  }, [selectedChain]);

  const onLedgerAppSelected = React.useCallback(
    async (ledgerApp: LedgerApp) => {
      const transport = await connectToLedger(ledgerApp);
      if (transport === undefined) {
        return;
      }

      selectAccount(
        {
          mode: WalletPickerMode.Ledger,
          ignoreAddresses,
          ledgerApp,
          transport,
          addressPrefix: selectedChain!.prefix,
          masterHdPath: ledgerApp.masterHdPath,
        },
        {
          onSuccess: account => {
            onSuccess({ account, chain: selectedChain! });
          },
        },
      );
    },
    [connectToLedger, selectAccount, ignoreAddresses, selectedChain, onSuccess],
  );

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<LedgerApp>) => {
      const handlePress = () => {
        onLedgerAppSelected(item);
      };
      return <LedgerAppItem app={item} handlePress={handlePress} />;
    },
    [onLedgerAppSelected],
  );

  const ItemSeparatorComponent = React.useCallback(() => {
    return <Spacer paddingVertical={theme.spacing.s} />;
  }, [theme.spacing.s]);

  return (
    <DView topBar={<TopBar />}>
      <View style={{ paddingHorizontal: theme.spacing.m }}>
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
          padding: theme.spacing.m,
        }}
        data={ledgerApplications}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
    </DView>
  );
};

export default ImportAccountSelectLedgerApp;
