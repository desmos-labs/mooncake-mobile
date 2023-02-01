import {toBase64} from '@cosmjs/encoding';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {ExternalAccount} from '@recoil/connectChainState';
import createLocalWalletState from '@recoil/createLocalWalletState';
import {useLoadProfiles} from '@recoil/profiles';
import walletAndAccountToAddState from '@recoil/walletAndAccountToAddState';
import AddressItem from 'components/AddressItem';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import useActiveAccount from 'hooks/useActiveAccount';
import useGenerateAccountsToAdd from 'hooks/useGenerateAccountsToAdd';
import LocalWallet from 'lib/LocalWallet';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, FlatList, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSetRecoilState} from 'recoil';
import {ChainAccount, ChainAccountType} from 'types/chains';
import useStyles from '../useStyles';

export type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.ADD_PROFILE_SELECT_ADDRESS_GENERAL
>;

export type AddProfileSelectAddressGeneralParams = {
  mnemonic?: string;
  password?: string;
};

const AddProfileSelectAddressGeneral = () => {
  const {activeAddress} = useActiveAccount();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const navigation = useNavigation<NavProps['navigation']>();
  const {
    params: {mnemonic, password},
  } = useRoute<NavProps['route']>();
  const {t} = useTranslation('addProfile');
  const styles = useStyles();
  const theme = useTheme();
  const {generateAccounts} = useGenerateAccountsToAdd();
  const {profiles} = useLoadProfiles();
  const setAccountCreation = useSetRecoilState(createLocalWalletState);
  const setWalletAndAccountToAdd = useSetRecoilState(
    walletAndAccountToAddState,
  );

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
          size={26}
          mode="text"
          textColor={theme.colors.butterOrange01}
          onPress={async () => {
            navigation.navigate(ROUTES.ADD_PROFILE_SELECT_ADDRESS_ADVANCED, {
              mnemonic,
            });
          }}>
          {t('advanced')}
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
      if (!activeAddress) {
        return <ActivityIndicator color={theme.colors.surfaceBlack} />;
      }
      const handlePress = async (wallet: ExternalAccount) => {
        const deserializedWallet = await LocalWallet.deserialize(
          wallet.signer as string,
        );
        const chainAccount: ChainAccount = {
          address: deserializedWallet.bech32Address,
          type: ChainAccountType.Local,
          pubKey: toBase64(deserializedWallet.publicKey),
          hdPath: wallet.hdPath,
          signAlgorithm: 'secp256k1',
        };
        setWalletAndAccountToAdd({
          accountWithWalletData: {
            chainAccount,
            wallet: wallet.signer as string,
          },
          password: password!,
          mnemonic: mnemonic!,
        });
        setAccountCreation({
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
          isAlreadyLinked={
            profiles.findIndex(profile => profile.address === item.address) !==
            -1
          }
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
      return (
        <ActivityIndicator
          style={{width: '100%', marginVertical: 16}}
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
