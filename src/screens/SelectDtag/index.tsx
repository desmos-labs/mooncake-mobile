import React from 'react';
import ProfileItem from 'screens/SelectDtag/components/ProfileItem';
import {useQuery} from '@apollo/client';
import GetProfileSummaryForAddresses from 'services/graphql/queries/GetProfileSummaryForAddresses';
import DView from 'components/DView';
import {ActivityIndicator, FlatList, ListRenderItemInfo} from 'react-native';
import {useTranslation} from 'react-i18next';
import Typography from 'components/Typography';
import Spacer from 'components/Spacer';

// This should be replaced by a list of addressese retrieved from the account
const DUMMY_ADDRESSES = [
  'desmos1dx6h75tkj0cuvyqf6cwn6usc9qynu39v0245m4',
  'desmos1n39pwnwnsurvh8zcxwaahttmkvqtxqdmyaln7n',
];

const SelectDtag = () => {
  const {t} = useTranslation('selectDtag');

  const {loading, data} = useQuery(GetProfileSummaryForAddresses, {
    variables: {
      addresses: DUMMY_ADDRESSES,
    },
  });

  const handlePressProfileItem = React.useCallback((address: string) => {
    // implementation
    console.log(address);
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
