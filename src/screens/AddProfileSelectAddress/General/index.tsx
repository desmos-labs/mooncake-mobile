import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {
  ExternalAccount,
  selectedExternalAccountState,
} from '@recoil/connectChainState';
import createLocalWalletState from '@recoil/createLocalWalletState';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import useActiveAccount from 'hooks/useActiveAccount';
import useCheckIsAddressLinked from 'hooks/useCheckIsAddressLinked';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, FlatList, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSetRecoilState} from 'recoil';
import useHooks from '../useHooks';
import useStyles from '../useStyles';
import AddressItem from './components/AddressItem';

export type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.ADD_PROFILE_SELECT_ADDRESS_GENERAL
>;

export type AddProfileSelectAddressGeneralParams = {
  mnemonic?: string;
};

const AddProfileSelectAddressGeneral = () => {
  const {activeAddress} = useActiveAccount();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const navigation = useNavigation<NavProps['navigation']>();
  const {
    params: {mnemonic},
  } = useRoute<NavProps['route']>();
  const {checkIsAddressLinked} = useCheckIsAddressLinked();
  const {t} = useTranslation('addProfile');
  const styles = useStyles();
  const theme = useTheme();
  const {generateAccounts} = useHooks();
  const setSelectedExternalAccount = useSetRecoilState(
    selectedExternalAccountState,
  );
  const setAccountCreation = useSetRecoilState(createLocalWalletState);

  const asyncGenerateAccounts = useCallback(
    async (startingIndex: number, limitIndex: number) => {
      try {
        setLoading(true);
        const generatedAccounts = await generateAccounts(
          startingIndex,
          limitIndex,
          mnemonic!,
        );
        if (generatedAccounts) {
          setAccounts(prev => [...prev, ...generatedAccounts]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [generateAccounts],
  );

  React.useEffect(() => {
    asyncGenerateAccounts(0, limit).then(() => setLimit(prev => prev + 10));
  }, []);

  const SwitchToAdvancedButton = React.useMemo(() => {
    return (
      <View style={styles.topBarButtonContainer}>
        <Button
          mode="text"
          onPress={async () => {
            navigation.navigate(ROUTES.ADD_PROFILE_SELECT_ADDRESS_ADVANCED, {
              mnemonic,
            });
          }}>
          <Typography.Button2 style={styles.modeButtonText}>
            {t('advanced')}
          </Typography.Button2>
        </Button>
      </View>
    );
  }, [navigation]);

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
      if (!activeAddress) return <ActivityIndicator />;
      const handlePress = async (wallet: ExternalAccount) => {
        setSelectedExternalAccount(wallet);
        setAccountCreation({
          mnemonic: mnemonic!,
          source: ROUTES.ADD_PROFILE_SELECT_ADDRESS_GENERAL,
        });
        navigation.navigate(ROUTES.CREATE_DESMOS_PROFILE);
      };

      return (
        <AddressItem
          key={item.address}
          index={index}
          address={item.address}
          handlePress={() => handlePress(item)}
          isAlreadyLinked={checkIsAddressLinked(item.address)}
        />
      );
    },
    [activeAddress],
  );

  const ItemSeparatorComponent = React.useCallback(
    () => <Spacer paddingVertical={theme.spacing.s} />,
    [],
  );

  const ListFooterComponent = React.useMemo(() => {
    if (loading) {
      return <ActivityIndicator style={{width: '100%', marginVertical: 16}} />;
    } else return <View />;
  }, [loading]);

  return (
    <DView
      topBar={<TopBar rightElement={SwitchToAdvancedButton} />}
      backgroundColor={theme.colors.white}>
      <View style={styles.container}>
        <Typography.H3 style={styles.textStyle}>
          {t('addProfile:title')}
        </Typography.H3>
        <Spacer paddingTop={theme.spacing.m} paddingBottom={theme.spacing.s}>
          <Typography.Body6 style={styles.textStyle}>
            {t('addProfile:select account')}
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
        refreshing={loading}
        onEndReached={() => {
          asyncGenerateAccounts(limit, limit + 10);
        }}
      />
      {ListFooterComponent}
    </DView>
  );
};

export default AddProfileSelectAddressGeneral;
