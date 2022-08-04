import React from 'react';
import DView from 'components/DView';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Typography from 'components/Typography';
import TopBar from 'components/TopBar';
import Spacer from 'components/Spacer';
import {useTheme} from 'react-native-paper';
import {FlatList, View} from 'react-native';
import useGenerateAccounts from './useGenerateAccounts';
import AddressItem from './components/AddressItem';
import useStyles from '../useStyles';

const DEBUG_MNEMONIC =
  'chef embody loan celery magnet replace refuse subway treat arena party purity lift estate afford shallow monitor vapor torch farm message kid cheap seed';

const ConnectAddressGeneral = () => {
  // placeholder
  const navigation = useNavigation<any>();

  const {t} = useTranslation('connectAddress');

  const styles = useStyles();

  const theme = useTheme();

  /**
   * for integration, replace mnemonic with the user's stored mnemonic, and
   * prefix with the correct prefix of the account to be connected
   */
  const {accounts, generateAccountsFromMnemonic} = useGenerateAccounts({
    mnemonic: DEBUG_MNEMONIC,
    prefix: 'desmos',
  });

  React.useEffect(() => {
    generateAccountsFromMnemonic();
  }, []);

  const SwitchToAdvancedButton = React.useMemo(() => {
    return (
      <View style={styles.topBarButtonContainer}>
        <Typography.Button2 style={styles.modeButtonText} onPress={() => {}}>
          {t('advanced')}
        </Typography.Button2>
      </View>
    );
  }, []);

  const renderItem = React.useCallback(({item, index}: any) => {
    return (
      <AddressItem
        key={item.bech32Address}
        index={index}
        address={item.bech32Address}
        handlePress={() => {
          console.log('hello world');
        }}
      />
    );
  }, []);

  const ItemSeparatorComponent = React.useCallback(
    () => <Spacer paddingVertical={theme.spacing.s} />,
    [],
  );

  return (
    <DView
      topBar={
        <TopBar
          stackProps={{navigation}}
          rightElement={SwitchToAdvancedButton}
        />
      }>
      <View style={styles.container}>
        <Typography.H5 style={styles.textStyle}>{t('header')}</Typography.H5>

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
