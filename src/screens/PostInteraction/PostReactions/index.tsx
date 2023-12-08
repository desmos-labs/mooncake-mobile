import { useFocusEffect, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import Typography from 'components/Typography';
import { formatNumShorthand } from 'lib/FormatUtils';
import { PostInteractionTabsParamList } from 'navigation/RootNavigator/PostInteractionTabs';
import ROUTES from 'navigation/routes';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import usePostReactions from 'hooks/reactions/usePostReactions';
import usePostReactionsCount from 'hooks/reactions/usePostReactionsCount';
import { Center } from 'native-base';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { clearTimeout } from '@testing-library/react-native/build/helpers/timers';
import StyledSpinner from 'components/StyledSpinner';
import { PostReaction } from 'types/desmos';
import ItemSeparatorComponent from '../components/ItemSeparatorComponent';
import ReactionItem from './components/ReactionItem';
import useStyles from './useStyles';

type NavProps = StackScreenProps<PostInteractionTabsParamList, ROUTES.POST_REACTIONS>;

/**
 * Screen that allows to display the list of reactions related to a post.
 * @constructor
 */
const PostReactions = () => {
  const { t } = useTranslation('postDetails');
  const styles = useStyles();

  const { params } = useRoute<NavProps['route']>();
  const { post } = params;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const { count, refetch: refetchCount } = usePostReactionsCount(post);
  const {
    data: reactions,
    loading,
    refresh: refetchReactions,
    fetchMore,
    refreshing,
  } = usePostReactions(post.id);

  const refetch = useCallback(async () => {
    await refetchReactions().then(() => refetchCount());
  }, [refetchCount, refetchReactions]);

  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(async () => {
        await refetch();
      }, 500);

      return () => clearTimeout(timeout);
    }, [refetch]),
  );

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------
  const renderItem = React.useCallback(({ item }: ListRenderItemInfo<PostReaction>) => {
    return <ReactionItem author={item.author} />;
  }, []);

  if (loading) {
    return (
      <Center>
        <StyledSpinner />
      </Center>
    );
  }

  return (
    <>
      {count > 0 && (
        <Typography.Body6 style={styles.countText}>
          {t('likes counter', { likesCounter: formatNumShorthand(count) })}
        </Typography.Body6>
      )}
      <FlashList
        refreshing={refreshing}
        onRefresh={refetch}
        keyExtractor={(item, index) => `${item.author.address}-${index}`}
        data={reactions}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListEmptyComponent={<EmptyListComponent label={t('no likes')} />}
        onEndReached={fetchMore}
        estimatedItemSize={63}
      />
    </>
  );
};

export default PostReactions;
