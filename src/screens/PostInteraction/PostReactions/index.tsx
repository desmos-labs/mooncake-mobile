import {useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import Typography from 'components/Typography';
import {formatNumShorthand} from 'lib/FormatUtils';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, ListRenderItemInfo} from 'react-native';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import ItemSeparatorComponent from '../components/ItemSeparatorComponent';
import ReactionItem from './components/ReactionItem';
import useHooks from './useHooks';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.POST_REACTIONS>;

const PostReactions = () => {
  const {t} = useTranslation('postInteraction');
  const styles = useStyles();
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
    <>
      {reactions.length > 0 && (
        <Typography.Body6 style={styles.countText}>
          {t('totalReactions', {
            numReactions: formatNumShorthand(reactions.length),
          })}
        </Typography.Body6>
      )}
      <FlatList
        refreshing={reactionsLoading}
        onRefresh={() =>
          reactionsRefetch({postID: postId, subspaceID: subspaceId})
        }
        keyExtractor={item => item.id}
        data={reactions}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainerStyle}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListEmptyComponent={ListEmptyComponent}
      />
    </>
  );
};

export default PostReactions;
