import React from 'react';
import {FlatList, ListRenderItemInfo} from 'react-native';
import {useTheme} from 'react-native-paper';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import {useTranslation} from 'react-i18next';
import Button from 'components/Button';
import ItemSeparatorComponent from '../components/ItemSeparatorComponent';
import CommentItem from './components/CommentItem';

const PostComments = () => {
  const theme = useTheme();

  const {t} = useTranslation('postInteraction');

  const renderItem = React.useCallback((info: ListRenderItemInfo<any>) => {
    return (
      <CommentItem
        handlePressMore={() => {
          console.log('hello world');
        }}
        handlePressComment={() => {
          console.log('hello world');
        }}
        handlePressLike={() => {
          console.log('hello world');
        }}
        handlePressTip={() => {
          console.log('hello world');
        }}
        handlePress={() => {
          console.log('hello world');
        }}
        {...info.item}
      />
    );
  }, []);

  const ListEmptyComponent = React.useMemo(() => {
    return (
      <EmptyListComponent
        label={t('noComments')}
        handleButtonPress={() => {
          // add comment
        }}
        buttonLabel={t('comment')}
      />
    );
  }, []);

  const ListFooterComponent = React.useMemo(() => {
    return <Button mode="gradientFilled">{t('comment')}</Button>;
  }, []);

  return (
    <FlatList
      data={DUMMY_COMMENTS}
      renderItem={renderItem}
      contentContainerStyle={{
        paddingHorizontal: theme.spacing.m,
        flexGrow: 1,
      }}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={ListFooterComponent}
      ItemSeparatorComponent={ItemSeparatorComponent}
    />
  );
};

const defaultProps = {
  avatar: {uri: 'https://i.imgur.com/aih9snA.png'},
  nickname: 'Shrek',
  dTag: 'Swampyboi',
  numComments: 1,
  numReactions: 2,
  numTips: 0,
  timestamp: '2022-07-03T16:00:40.08408',
  text: 'Lorem ipsum dolor sit amet, rices in iaculis nunc sed augue lacus, viverra vitae congue eu, consequat ac felis donec et odio pellent',
};

const imageCommentProps = {
  ...defaultProps,
  attachments: [
    {
      id: 1,
      content: {
        uri: 'https://i.imgur.com/aih9snA.png',
        '@type': '/desmos.posts.v1.Media',
        mime_type: 'image/png',
      },
    },
  ],
};

const likedCommentProps = {
  ...defaultProps,
  liked: true,
};

const DUMMY_COMMENTS = [
  defaultProps,
  likedCommentProps,
  imageCommentProps,
  defaultProps,
];

export default PostComments;
