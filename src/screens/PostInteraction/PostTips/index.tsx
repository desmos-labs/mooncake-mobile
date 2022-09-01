import {useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {PostInteractionTabsParamList} from 'navigation/RootNavigator/PostInteractionTabs';
import ROUTES from 'navigation/routes';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, ListRenderItemInfo} from 'react-native';
import {useTheme} from 'react-native-paper';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import ItemSeparatorComponent from 'screens/PostInteraction/components/ItemSeparatorComponent';
import TipItem from 'screens/PostInteraction/PostTips/components/TipItem';

type NavProps = StackScreenProps<
  PostInteractionTabsParamList,
  ROUTES.POST_TIPS
>;

const PostTips = () => {
  const {t} = useTranslation('postInteraction');
  const theme = useTheme();
  const {params} = useRoute<NavProps['route']>();

  useEffect(() => {
    console.log('params', params);
  }, [params]);

  const renderItem = React.useCallback(({item}: ListRenderItemInfo<any>) => {
    return (
      <TipItem
        tipAmount={item.tipAmount}
        avatar={item.avatar}
        nickname={item.nickname}
        dTag={item.dTag}
        timestamp={item.timestamp}
      />
    );
  }, []);

  const ListEmptyComponent = React.useCallback(() => {
    return <EmptyListComponent label={t('noTips')} />;
  }, []);

  return (
    <FlatList
      data={[]}
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
