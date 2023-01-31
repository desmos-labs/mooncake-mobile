import {
  CompositeScreenProps,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {defaultProfilePic} from 'assets/images';
import Typography from 'components/Typography';
import {formatNumShorthand} from 'lib/FormatUtils';
import {MMKVKEYS, useMMKVStorage} from 'lib/MMKVStorage';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import {PostInteractionTabsParamList} from 'navigation/RootNavigator/PostInteractionTabs';
import ROUTES from 'navigation/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, ListRenderItemInfo} from 'react-native';
import {useTheme} from 'react-native-paper';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import ItemSeparatorComponent from 'screens/PostInteraction/components/ItemSeparatorComponent';
import useStyles from 'screens/PostInteraction/PostReactions/useStyles';
import TipItem from 'screens/PostInteraction/PostTips/components/TipItem';
import useHooks from './useHooks';

type NavProps = CompositeScreenProps<
  StackScreenProps<PostInteractionTabsParamList, ROUTES.POST_TIPS>,
  StackScreenProps<RootNavigatorParamList>
>;

const PostTips = () => {
  const {t} = useTranslation('postInteraction');
  const theme = useTheme();
  const {
    params: {postId, subspaceId},
  } = useRoute<NavProps['route']>();
  const {navigate} = useNavigation<NavProps['navigation']>();
  const styles = useStyles();
  const [activeAddress] = useMMKVStorage<string | undefined>(
    MMKVKEYS.ACTIVE_ACCOUNT_ADDRESS,
  );
  const {tips, tipsLoading, tipsRefetch} = useHooks({
    postId,
    subspaceId,
  });

  const renderItem = React.useCallback(
    ({item}: ListRenderItemInfo<any>) => {
      return (
        <TipItem
          address={item.sender?.address}
          tipAmount={item.amount[0]}
          avatar={
            item.sender.profile_pic
              ? {uri: item.sender.profile_pic}
              : defaultProfilePic
          }
          nickname={item.sender.nickname}
          dTag={item.sender.dtag}
        />
      );
    },
    [tips],
  );

  const handlePressSendTips = React.useCallback(() => {
    navigate(ROUTES.SEND_TIPS, {postAuthor: activeAddress!});
  }, [activeAddress]);

  const ListEmptyComponent = React.useCallback(() => {
    return (
      <EmptyListComponent
        label={t('noTips')}
        additionalButton
        buttonLabel={t('tip')}
        handleButton={handlePressSendTips}
        additionalButtonStyle={{backgroundColor: theme.colors.black}}
      />
    );
  }, []);

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
        refreshing={tipsLoading}
        onRefresh={tipsRefetch}
        data={tips}
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
        ItemSeparatorComponent={ItemSeparatorComponent}
        contentContainerStyle={styles.contentContainerStyle}
        ListFooterComponentStyle={{
          marginTop: theme.spacing.xl,
        }}
      />
    </>
  );
};

export default PostTips;
