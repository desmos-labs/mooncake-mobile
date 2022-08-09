import React from 'react';
import {FlatList, ListRenderItemInfo} from 'react-native';
import {useTranslation} from 'react-i18next';
import TipItem from 'screens/PostInteraction/PostTips/components/TipItem';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import ItemSeparatorComponent from 'screens/PostInteraction/components/ItemSeparatorComponent';
import {useTheme} from 'react-native-paper';

const PostTips = () => {
  const {t} = useTranslation('postInteraction');
  const theme = useTheme();

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
    return (
      <EmptyListComponent
        label={t('noTips')}
        buttonLabel={t('tip')}
        handleButtonPress={() => {
          // tip
        }}
      />
    );
  }, []);

  return (
    <FlatList
      data={DUMMY_TIPS}
      renderItem={renderItem}
      ListEmptyComponent={ListEmptyComponent}
      ItemSeparatorComponent={ItemSeparatorComponent}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: theme.spacing.m,
      }}
    />
  );
};

const DUMMY_TIPS = [
  {
    tipAmount: 1,
    avatar: {uri: 'https://i.imgur.com/aih9snA.png'},
    nickname: 'Shrek',
    dTag: 'SwampyBoi',
    timestamp: '2022-07-03T16:00:40.08408',
  },
  {
    tipAmount: 1,
    avatar: {uri: 'https://i.imgur.com/aih9snA.png'},
    nickname: 'Shrek',
    dTag: 'SwampyBoi',
    timestamp: '2022-07-03T16:00:40.08408',
  },
  {
    tipAmount: 1,
    avatar: {uri: 'https://i.imgur.com/aih9snA.png'},
    nickname: 'Shrek',
    dTag: 'SwampyBoi',
    timestamp: '2022-07-03T16:00:40.08408',
  },
  {
    tipAmount: 1,
    avatar: {uri: 'https://i.imgur.com/aih9snA.png'},
    nickname: 'Shrek',
    dTag: 'SwampyBoi',
    timestamp: '2022-07-03T16:00:40.08408',
  },
  {
    tipAmount: 1,
    avatar: {uri: 'https://i.imgur.com/aih9snA.png'},
    nickname: 'Shrek',
    dTag: 'SwampyBoi',
    timestamp: '2022-07-03T16:00:40.08408',
  },
];

export default PostTips;
