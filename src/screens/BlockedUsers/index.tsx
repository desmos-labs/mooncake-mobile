import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { emptyListPlaceholder } from 'assets/images';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import useBlocked from 'hooks/relationships/useBlocked';
import { Box, Divider } from 'native-base';
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
  } = useBlocked();

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

  const ItemSeparatorComponent = React.useCallback(
    () => <Divider my="s" color="dividerGrey" />,
    [],
  );

  return (
    <DView
      topBar={<TopBar style={styles.topBar} />}
      backgroundColor="white"
      disableHideKeyboardTouchable>
      <Box ml="20px" mb="l">
        <Typography.Semibold24>{t('blocked users')}</Typography.Semibold24>
      </Box>
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
