import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import BottomUpModalWrapper from 'components/BottomUpModalWrapper';
import StyledSpinner from 'components/StyledSpinner';
import Typography from 'components/Typography';
import usePostReactions from 'hooks/reactions/usePostReactions';
import usePostReactionsCount from 'hooks/reactions/usePostReactionsCount';
import { formatNumShorthand } from 'lib/FormatUtils';
import { Center } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import { PostReaction } from 'types/desmos';
import { Post } from 'types/posts';
import ItemSeparatorComponent from '../components/ItemSeparatorComponent';
import ReactionItem from './components/ReactionItem';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.POST_REACTIONS>;

export type PostReactionsParams = {
  /**
   * The post to show the interactions for.
   */
  post: Post;
};

/**
 * Screen that allows to display the list of reactions related to a post.
 * @constructor
 */
const PostReactions = () => {
  const { t } = useTranslation('postDetails');
  const styles = useStyles();
  const { goBack } = useNavigation<NavProps['navigation']>();
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
    <BottomUpModalWrapper goBack={goBack} paddingHorizontal={0.1}>
      <View style={styles.container}>
        <Typography.H6 style={styles.header}>{t('likes')}</Typography.H6>
        {count > 0 && (
          <Typography.Body6 style={styles.countText}>
            {t('likes counter', { likesCounter: formatNumShorthand(count) })}
          </Typography.Body6>
        )}
        <FlashList
          refreshing={!loading && refreshing}
          onRefresh={refetch}
          keyExtractor={(item, index) => `${item.author.address}-${index}`}
          data={reactions}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparatorComponent}
          ListEmptyComponent={<EmptyListComponent label={t('no likes')} />}
          onEndReached={fetchMore}
          estimatedItemSize={63}
        />
      </View>
    </BottomUpModalWrapper>
  );
};

export default PostReactions;
