import React from 'react';
import {FlatList, ListRenderItemInfo} from 'react-native';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import {useTranslation} from 'react-i18next';
import ReactionItem from './components/ReactionItem';
import ItemSeparatorComponent from '../components/ItemSeparatorComponent';

const PostReactions = () => {
  const {t} = useTranslation('postInteraction');

  const handlePressFollow = React.useCallback((address: string) => {
    console.log('follow', address);
  }, []);

  const handlePressUnfollow = React.useCallback((address: string) => {
    console.log('unfollow', address);
  }, []);

  const renderItem = React.useCallback(({item}: ListRenderItemInfo<any>) => {
    return (
      <ReactionItem
        nickname={item.nickname}
        dTag={item.dTag}
        avatar={item.avatar}
        handlePressFollow={() => {
          handlePressFollow(item.address);
        }}
        handlePressUnfollow={() => {
          handlePressUnfollow(item.address);
        }}
        followed={item.followed}
      />
    );
  }, []);

  const ListEmptyComponent = React.useCallback(() => {
    return <EmptyListComponent label={t('noReactions')} />;
  }, []);

  return (
    <FlatList
      keyExtractor={item => item.address}
      data={DUMMY_REACTIONS}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparatorComponent}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
};

const DUMMY_REACTIONS = [
  {
    nickname: 'Shrek',
    dTag: 'SwampyBoi',
    avatar: {uri: 'https://i.imgur.com/aih9snA.png'},
    address: '123123g',
  },
  {
    nickname: 'Shrek',
    dTag: 'SwampyBoi',
    avatar: {uri: 'https://i.imgur.com/aih9snA.png'},
    address: '123123f',
  },
  {
    nickname: 'Shrek',
    dTag: 'SwampyBoi',
    avatar: {uri: 'https://i.imgur.com/aih9snA.png'},
    followed: true,
    address: '123123d',
  },
  {
    nickname: 'Shrek',
    dTag: 'SwampyBoi',
    avatar: {uri: 'https://i.imgur.com/aih9snA.png'},
    address: '123123s',
  },
  {
    nickname: 'Shrek',
    dTag: 'SwampyBoi',
    avatar: {uri: 'https://i.imgur.com/aih9snA.png'},
    address: '123123a',
  },
];

export default PostReactions;
