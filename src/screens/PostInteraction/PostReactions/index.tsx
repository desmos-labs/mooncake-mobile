import {useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {PostInteractionTabsParamList} from 'navigation/RootNavigator/PostInteractionTabs';
import ROUTES from 'navigation/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, ListRenderItemInfo} from 'react-native';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import useHooks from './useHooks';
import ItemSeparatorComponent from '../components/ItemSeparatorComponent';
import ReactionItem from './components/ReactionItem';

type NavProps = StackScreenProps<
  PostInteractionTabsParamList,
  ROUTES.POST_REACTIONS
>;

const PostReactions = () => {
  const {t} = useTranslation('postInteraction');
  const {
    params: {postId, subspaceId},
  } = useRoute<NavProps['route']>();
  const {reactions, reactionsLoading, reactionsRefetch} = useHooks({
    postId,
    subspaceId,
  });

  const renderItem = React.useCallback(({item}: ListRenderItemInfo<any>) => {
    return <ReactionItem reaction={item} />;
  }, []);

  const ListEmptyComponent = React.useMemo(() => {
    return <EmptyListComponent label={t('noReactions')} />;
  }, []);

  return (
    <FlatList
      refreshing={reactionsLoading}
      onRefresh={() =>
        reactionsRefetch({postID: postId, subspaceID: subspaceId})
      }
      keyExtractor={item => item.id}
      data={reactions}
      renderItem={renderItem}
      contentContainerStyle={{
        flexGrow: 1,
      }}
      ItemSeparatorComponent={ItemSeparatorComponent}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
};

export default PostReactions;
