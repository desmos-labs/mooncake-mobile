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
import {setItem} from 'lib/SecureStorage';
import {MMKVKEYS, setMMKV} from 'lib/MMKVStorage';

export type SelectDtagParamList = {
  accountsWithWalletData: {
    address: string;
    /**
     * serialized wallet data
     */
    wallet: string;
  }[];

  /**
   * Ledger imports may not have an account
   */
  password?: string;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SELECT_DTAG>;

const SelectDtag = () => {
  const {t} = useTranslation('selectDtag');

  const {navigate} = useNavigation<NavProps['navigation']>();

  const {
    params: {accountsWithWalletData, password},
  } = useRoute<NavProps['route']>();

  const {loading, data} = useQuery(GetProfileSummaryForAddresses, {
    variables: {
      addresses: accountsWithWalletData.map((x: any) => x.address),
    },
  });

  const handlePressProfileItem = React.useCallback(async (address: string) => {
    // implementation
    const walletData = accountsWithWalletData.find(x => x.address === address);

    await setItem(`${address}_key`, walletData!.wallet, {password});
    setMMKV(MMKVKEYS.ACTIVE_WALLET_ADDR, address);

    // TODO: refactor with reset
    navigate(ROUTES.HOME);
  }, []);

  const renderItem = ({
    item,
  }: ListRenderItemInfo<{
    address: string;
    dtag: string;
    profile_pic: string;
    nickname: string;
  }>) => {
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
    <DView>
      <Spacer padding={16}>
        <Typography.H4>{t('header')}</Typography.H4>
        <Spacer paddingVertical={16}>
          <Typography.Body6>{t('description')}</Typography.Body6>
        </Spacer>
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
