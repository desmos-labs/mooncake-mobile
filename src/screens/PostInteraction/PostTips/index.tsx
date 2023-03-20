import {
  CompositeScreenProps,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import Typography from 'components/Typography';
import { formatNumShorthand } from 'lib/FormatUtils';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { PostInteractionTabsParamList } from 'navigation/RootNavigator/PostInteractionTabs';
import ROUTES from 'navigation/routes';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { useTheme } from 'native-base';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import ItemSeparatorComponent from 'screens/PostInteraction/components/ItemSeparatorComponent';
import useStyles from 'screens/PostInteraction/PostReactions/useStyles';
import TipItem from 'screens/PostInteraction/PostTips/components/TipItem';
import { Tip, TipTargetType } from 'types/tips';
import usePostTips from 'hooks/tips/usePostTips';

type NavProps = CompositeScreenProps<
  StackScreenProps<PostInteractionTabsParamList, ROUTES.POST_TIPS>,
  StackScreenProps<RootNavigatorParamList>
>;

/**
 * Screen that allows the user to see all the tips that have been sent to a given post.
 * @constructor
 */
const PostTips = () => {
  const { navigate } = useNavigation<NavProps['navigation']>();
  const { t } = useTranslation('postInteraction');
  const theme = useTheme();
  const styles = useStyles();

  const { params } = useRoute<NavProps['route']>();
  const { post } = params;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const { tips, loading: areTipsLoading, refetch: refetchTips, fetchMore } = usePostTips(post);

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const handlePressSendTips = React.useCallback(() => {
    navigate(ROUTES.POST_SEND_TIPS, {
      target: {
        type: TipTargetType.POST,
        post,
      },
    });
  }, [navigate, post]);

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  const renderItem = React.useCallback(({ item }: ListRenderItemInfo<Tip>) => {
    return <TipItem tip={item} />;
  }, []);

  const ListEmptyComponent = React.useCallback(() => {
    return (
      <EmptyListComponent
        label={t('noTips')}
        additionalButton
        buttonLabel={t('tip')}
        handleButton={handlePressSendTips}
      />
    );
  }, [handlePressSendTips, t]);

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  useFocusEffect(
    useCallback(() => {
      refetchTips();
    }, [refetchTips]),
  );

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <>
      {tips.length > 0 && (
        <Typography.Body6 style={styles.countText}>
          {t('totalTips', {
            numTips: formatNumShorthand(tips.length),
          })}
        </Typography.Body6>
      )}
      <FlatList
        data={tips}
        refreshing={areTipsLoading}
        onRefresh={refetchTips}
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
        ItemSeparatorComponent={ItemSeparatorComponent}
        contentContainerStyle={styles.contentContainerStyle}
        ListFooterComponentStyle={{ marginTop: theme.spacing.xl }}
        onEndReached={fetchMore}
      />
    </>
  );
};

export default PostTips;
