import React from 'react';
import {FlatList, ListRenderItemInfo} from 'react-native';
import {useTranslation} from 'react-i18next';
import TipItem from 'screens/PostInteraction/PostTips/components/TipItem';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import ItemSeparatorComponent from 'screens/PostInteraction/components/ItemSeparatorComponent';
import {useTheme} from 'react-native-paper';
import Button from 'components/Button';
import {StackScreenProps} from '@react-navigation/stack';
import {CompositeScreenProps, useNavigation} from '@react-navigation/native';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import {PostInteractionTabsParamList} from 'navigation/RootNavigator/PostInteractionTabs';
import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import ROUTES from 'navigation/routes';

type NavProps = CompositeScreenProps<
  StackScreenProps<RootNavigatorParamList, any>,
  MaterialTopTabScreenProps<PostInteractionTabsParamList, ROUTES.POST_TIPS>
>;

const PostTips = () => {
  const {t} = useTranslation('postInteraction');
  const theme = useTheme();

  const {navigate} = useNavigation<NavProps['navigation']>();

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

  const handlePressTip = React.useCallback(() => {
    navigate(ROUTES.SEND_TIPS);
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

  const ListFooterComponent = React.useCallback(() => {
    return (
      <Button mode="gradientFilled" onPress={handlePressTip}>
        {t('tip')}
      </Button>
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
      ListFooterComponentStyle={{
        marginTop: theme.spacing.xl,
      }}
      ListFooterComponent={ListFooterComponent}
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
