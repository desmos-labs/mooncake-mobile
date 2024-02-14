import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import BottomUpModalWrapper from 'components/BottomUpModalWrapper';
import Spacer from 'components/Spacer';
import StyledSpinner from 'components/StyledSpinner';
import usePostReactions from 'hooks/reactions/usePostReactions';
import usePostReactionsCount from 'hooks/reactions/usePostReactionsCount';
import { formatNumShorthand } from 'lib/FormatUtils';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import { PostReaction } from 'types/desmos';
import { Post } from 'types/posts';
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

  const renderEmptyComponent = React.useCallback(() => {
    return loading ? null : <EmptyListComponent label={t('no likes')} />;
  }, [loading, t]);

  const renderFooterComponent = React.useCallback(() => {
    if (loading) {
      return (
        <View>
          <StyledSpinner />
        </View>
      );
    }
  }, [loading]);

  return (
    <BottomUpModalWrapper goBack={goBack} paddingHorizontal={0.1}>
      <View style={styles.container}>
        <Typography.Semibold16 style={styles.header}>
          {formatNumShorthand(count)} {t('likes')}
        </Typography.Semibold16>

        <FlashList
          refreshing={refreshing}
          onRefresh={refetch}
          keyExtractor={(item, index) => `${item.author.address}-${index}`}
          data={reactions}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Spacer paddingBottom="l" />}
          ListEmptyComponent={renderEmptyComponent}
          onEndReached={fetchMore}
          ListFooterComponent={renderFooterComponent}
          estimatedItemSize={70}
          onEndReachedThreshold={0.2}
        />
      </View>
    </BottomUpModalWrapper>
  );
};

export default PostReactions;
