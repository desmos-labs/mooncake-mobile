import { useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import Typography from 'components/Typography';
import { formatNumShorthand } from 'lib/FormatUtils';
import { PostInteractionTabsParamList } from 'navigation/RootNavigator/PostInteractionTabs';
import ROUTES from 'navigation/routes';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ListRenderItemInfo } from 'react-native';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import useGetPostReactions from 'hooks/useGetPostReactions';
import useGetPostReactionsCount from 'hooks/useGetPostReactionsCount';
import { Post } from 'types/posts';
import ItemSeparatorComponent from '../components/ItemSeparatorComponent';
import ReactionItem from './components/ReactionItem';
import useStyles from './useStyles';

type NavProps = StackScreenProps<PostInteractionTabsParamList, ROUTES.POST_REACTIONS>;

/**
 * Screen that allows to display the list of reactions related to a post.
 * @constructor
 */
const PostReactions = () => {
  const { t } = useTranslation('postInteraction');
  const styles = useStyles();

  const { params } = useRoute<NavProps['route']>();
  const { subspaceId, postId } = params;
  const postData = { subspaceId, id: postId } as Pick<Post, 'subspaceId' | 'id'>;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const { count, refetch: refetchCount } = useGetPostReactionsCount(postData);
  const {
    reactions,
    loading,
    refetch: refetchReactions,
    fetchMore,
  } = useGetPostReactions(postData);

  const refetch = useCallback(() => {
    refetchCount();
    refetchReactions();
  }, [refetchCount, refetchReactions]);

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  const renderItem = React.useCallback(({ item }: ListRenderItemInfo<any>) => {
    return <ReactionItem reaction={item} />;
  }, []);

  const ListEmptyComponent = React.useMemo(() => {
    return <EmptyListComponent label={t('noReactions')} />;
  }, [t]);

  return (
    <>
      {count > 0 && (
        <Typography.Body6 style={styles.countText}>
          {t('totalReactions', { numReactions: formatNumShorthand(count) })}
        </Typography.Body6>
      )}
      <FlatList
        refreshing={loading}
        onRefresh={refetch}
        keyExtractor={item => item.id?.toString() ?? ''}
        data={reactions}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainerStyle}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListEmptyComponent={ListEmptyComponent}
        onEndReached={fetchMore}
      />
    </>
  );
};

export default PostReactions;
