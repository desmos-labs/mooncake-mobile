import TopBar from 'components/TopBar';
import React from 'react';
import ProfileItem from 'screens/SelectDtag/components/ProfileItem';
import {useQuery} from '@apollo/client';
import GetProfileSummaryForAddresses from 'services/graphql/queries/GetProfileSummaryForAddresses';
import DView from 'components/DView';
import {ActivityIndicator, FlatList, ListRenderItemInfo} from 'react-native';
import {useTranslation} from 'react-i18next';
import Typography from 'components/Typography';
import Spacer from 'components/Spacer';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useNavigation, useRoute} from '@react-navigation/native';
import {saveLocalWallet, saveMnemonic, saveNewAccount} from 'lib/SecureStorage';
import {ChainAccount} from 'types/chains';
import LocalWallet from 'lib/LocalWallet';
import {useRecoilValue, useResetRecoilState} from 'recoil';
import createLocalWalletState from '@recoil/createLocalWalletState';
import useActiveAccount from 'hooks/useActiveAccount';

export type SelectDtagParamList = {
  accountsWithWalletData: {
    chainAccount: ChainAccount;
    /**
     * serialized wallet data
     */
    wallet?: string;
  }[];

  password?: string;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SELECT_DTAG>;

const SelectDtag = () => {
  const {t} = useTranslation('selectDtag');

  const {reset} = useNavigation<NavProps['navigation']>();
  const {setActiveAddress} = useActiveAccount();

  const {
    params: {accountsWithWalletData, password},
  } = useRoute<NavProps['route']>();

  const createLocalWalletValues = useRecoilValue(createLocalWalletState);
  const resetCreateLocalWalletAtom = useResetRecoilState(
    createLocalWalletState,
  );

  const {loading, data} = useQuery(GetProfileSummaryForAddresses, {
    variables: {
      addresses: accountsWithWalletData.map(
        (x: {chainAccount: ChainAccount}) => x.chainAccount.address,
      ),
    },
  });

  const handlePressProfileItem = React.useCallback(async (address: string) => {
    // implementation
    const walletData = accountsWithWalletData.find(
      x => x.chainAccount.address === address,
    );
    if (!walletData) return;
    const {wallet, chainAccount} = walletData;

    // ledger accounts won't have wallet data
    // if a wallet is passed, then there will be a password as well
    if (wallet) {
      const deserializedWallet = await LocalWallet.deserialize(wallet);

      await saveLocalWallet(deserializedWallet, password!);
      await saveMnemonic(
        deserializedWallet.bech32Address,
        createLocalWalletValues.mnemonic!,
        password!,
      );
    }
    await saveNewAccount(chainAccount);

    setActiveAddress(address);
    // setMMKV(MMKVKEYS.ACTIVE_ACCOUNT_ADDR, address);

    resetCreateLocalWalletAtom();

    reset({
      index: 0,
      routes: [
        {
          name: ROUTES.BOTTOM_TABS,
        },
      ],
    });
  }, []);

  const renderItem = ({item}: ListRenderItemInfo<ProfileSummary>) => {
    return (
      <ProfileItem
        nickname={item.nickname}
        dtag={item.dtag}
        avatar={{uri: item.profile_pic}}
        handlePress={() => handlePressProfileItem(item.address)}
      />
    );
  };

  const ItemSeparatorComponent = React.useCallback(
    () => <Spacer paddingVertical={8} />,
    [],
  );

  if (loading) {
    return (
      <DView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </DView>
    );
  }

  return (
    <DView topBar={<TopBar />}>
      <Spacer padding={16}>
        <Typography.H4>{t('header')}</Typography.H4>
      </Spacer>

      <FlatList
        data={data.profile}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
        contentContainerStyle={{
          padding: 16,
          flexGrow: 1,
        }}
      />
    </DView>
  );
};

export default SelectDtag;
