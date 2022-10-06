import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {MMKVKEYS, useMMKVStorage} from 'lib/MMKVStorage';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, ListRenderItemInfo} from 'react-native';
import {useTheme} from 'react-native-paper';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import ItemSeparatorComponent from 'screens/PostInteraction/components/ItemSeparatorComponent';
import TipItem from 'screens/PostInteraction/PostTips/components/TipItem';
import {GetTipsByPostID} from 'services/axios/requests/GetContractsTips';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.POST_TIPS>;

const PostTips = () => {
  const {t} = useTranslation('postInteraction');
  const theme = useTheme();
  const {params} = useRoute<NavProps['route']>();
  const {navigate} = useNavigation<NavProps['navigation']>();
  const [activeAddress] = useMMKVStorage<string | undefined>(
    MMKVKEYS.ACTIVE_ACCOUNT_ADDR,
  );
  const [tipsData, setTipsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTipsData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await GetTipsByPostID({postID: params.postId});
      if (data) {
        setTipsData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [params.postId]);

  useEffect(() => {
    fetchTipsData();
  }, [params.postId]);

  const renderItem = React.useCallback(
    ({item}: ListRenderItemInfo<any>) => {
      return (
        <TipItem
          address={item.sender}
          tipAmount={item.amount[0]}
          avatar={item.avatar}
          nickname={item.nickname}
          dTag={item.dTag}
          timestamp={item.timestamp}
        />
      );
    },
    [tipsData],
  );

  const handlePressSendTips = React.useCallback(() => {
    navigate(ROUTES.SEND_TIPS, {postAuthor: activeAddress!});
  }, [activeAddress]);

  const ListEmptyComponent = React.useCallback(() => {
    return (
      <EmptyListComponent
        label={t('noTips')}
        additionalButton
        buttonLabel={t('tip')}
        handleButton={() => handlePressSendTips()}
      />
    );
  }, []);

  return (
    <FlatList
      refreshing={loading}
      onRefresh={fetchTipsData}
      data={tipsData}
      renderItem={renderItem}
      ListEmptyComponent={ListEmptyComponent}
      ItemSeparatorComponent={ItemSeparatorComponent}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: theme.spacing.m,
      }}
      ListFooterComponentStyle={{
        marginTop: theme.spacing.xl,
      }}
    />
  );
};

export default PostTips;
