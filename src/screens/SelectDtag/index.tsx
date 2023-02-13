import TopBar from 'components/TopBar';
import React from 'react';
import {useTheme} from 'react-native-paper';
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
import {useRoute} from '@react-navigation/native';
import {ChainAccount} from 'types/chains';
import useHooks from './useHooks';

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

export type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.SELECT_DTAG
>;

const SelectDtag = () => {
  const {t} = useTranslation('selectDtag');
  const theme = useTheme();

  const {handlePressProfileItem} = useHooks();

  const {
    params: {accountsWithWalletData},
  } = useRoute<NavProps['route']>();

  const {loading, data} = useQuery(GetProfileSummaryForAddresses, {
    variables: {
      addresses: accountsWithWalletData.map(
        (x: {chainAccount: ChainAccount}) => x.chainAccount.address,
      ),
    },
  });

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
        <ActivityIndicator color={theme.colors.surfaceBlack} />
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
