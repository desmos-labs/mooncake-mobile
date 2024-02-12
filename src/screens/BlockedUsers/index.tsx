import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { emptyListPlaceholder } from 'assets/images';
import Divider from 'components/Divider';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import useBlockedUsers from 'hooks/relationships/useBlockedUsers';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import BlockedUserItem from 'screens/BlockedUsers/components/BlockedUserItem';
import { DesmosProfile } from 'types/desmos';
import useStyles from './useStyles';

/**
 * A screen that displays the blocked users of the active user.
 */
const BlockedUsers = () => {
  const { t } = useTranslation('relationships');
  const styles = useStyles();

  // -------------------------------------------------------------------------------------------------------------------
  // --- HOOKS
  // -------------------------------------------------------------------------------------------------------------------

  const {
    data: blocked,
    loading,
    refresh: refreshBlocked,
    fetchMore: fetchMoreBlocked,
  } = useBlockedUsers();

  // -------------------------------------------------------------------------------------------------------------------
  // --- CALLBACKS
  // -------------------------------------------------------------------------------------------------------------------

  const onPullToRefresh = React.useCallback(() => {
    refreshBlocked();
  }, [refreshBlocked]);

  // -------------------------------------------------------------------------------------------------------------------
  // --- SCREEN RENDERING
  // -------------------------------------------------------------------------------------------------------------------

  const renderItem = React.useCallback(({ item }: ListRenderItemInfo<DesmosProfile>) => {
    return <BlockedUserItem profile={item} />;
  }, []);

  const emptyComponent = useMemo(() => {
    if (!loading && blocked.length === 0) {
      return (
        <View style={styles.emptyView}>
          <Image source={emptyListPlaceholder} style={styles.emptyImage} />
          <Typography.Regular14>{t('no blocked users')}</Typography.Regular14>
        </View>
      );
    }
  }, [loading, blocked.length, styles.emptyView, styles.emptyImage, t]);

  const ItemSeparatorComponent = React.useCallback(() => <Divider />, []);

  return (
    <DView
      topBar={
        <TopBar
          style={styles.topBar}
          centerElement={<Typography.Semibold16>{t('blocked users')}</Typography.Semibold16>}
        />
      }
      backgroundColor="white"
      disableHideKeyboardTouchable>
      <Spacer paddingBottom="l" />
      <FlashList
        scrollEnabled
        refreshing={loading}
        onRefresh={onPullToRefresh}
        estimatedItemSize={100}
        renderItem={renderItem}
        data={blocked}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListEmptyComponent={emptyComponent}
        onEndReached={fetchMoreBlocked}
      />
    </DView>
  );
};

export default BlockedUsers;
