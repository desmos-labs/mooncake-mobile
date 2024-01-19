import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useFocusEffect } from '@react-navigation/native';
import { useSetAppStateValue } from '@recoil/appState';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { emptyListPlaceholder } from 'assets/images';
import DView from 'components/DView';
import StyledSpinner from 'components/StyledSpinner';
import useHandleNotificationNavigation from 'hooks/notifications/useHandleNotificationNavigation';
import useNotificationsHistory from 'hooks/notifications/useNotificationsHistory';
import { Divider, useTheme } from 'native-base';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Platform, RefreshControl, View } from 'react-native';
import NotificationComponent from 'screens/Activities/components/NotificationItem';
import useSplitNotificationsByWeek from 'screens/Activities/hooks';
import { Notification } from 'types/notifications';
import useStyles from './useStyles';

/**
 * Screen that allows the user to view their past notifications and interact with them.
 * @constructor
 */
const Activities = () => {
  const { t } = useTranslation('activities');
  const theme = useTheme();
  const styles = useStyles();

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const {
    notifications,
    loading,
    fetchMore,
    refetch: refreshNotifications,
    refreshing,
  } = useNotificationsHistory();

  const splitNotificationsByWeek = useSplitNotificationsByWeek();
  const handleNotificationNavigation = useHandleNotificationNavigation();

  // -------- CALLBACKS --------

  const onNotificationPressed = React.useCallback(
    (notification: Notification) => {
      handleNotificationNavigation(notification.additionalData);
    },
    [handleNotificationNavigation],
  );

  // -------------------------------------------------------------------------------------
  // --- Formatted data
  // -------------------------------------------------------------------------------------

  const items = useMemo(
    () => splitNotificationsByWeek(notifications),
    [notifications, splitNotificationsByWeek],
  );

  // Indexes of the headers that should stick within the list
  const stickyHeaderIndices = useMemo(() => {
    return items
      ?.map((item, index) => {
        if (typeof item === 'string') {
          return index;
        } else {
          return null;
        }
      })
      .filter(item => item !== null) as number[];
  }, [items]);

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  // Component shown if there are no past activities
  const EmptyActivities = useMemo(() => {
    if (loading || notifications.length > 0) {
      return;
    }
    return (
      <View style={styles.emptyView}>
        <Image source={emptyListPlaceholder} style={styles.errorImage} />
        <Typography.Regular14>{t('no activities')}</Typography.Regular14>
      </View>
    );
  }, [loading, notifications.length, styles.emptyView, styles.errorImage, t]);

  // Function that is used in order to render each item within the list
  const renderItem = useCallback(
    (info: ListRenderItemInfo<Notification | string>) => {
      const { item } = info;
      if (typeof item === 'string') {
        // Render a divider
        if (item === 'divider') {
          return (
            <View style={styles.divider}>
              <Divider />
            </View>
          );
        }

        // Render a section header
        return (
          <View style={styles.sectionHeader}>
            <Typography.Semibold14>{t(item as any)}</Typography.Semibold14>
          </View>
        );
      }

      // Render a notification
      return <NotificationComponent notification={item} onPress={onNotificationPressed} />;
    },
    [styles, onNotificationPressed, t],
  );

  // Component shown at the bottom tof the page
  const FooterComponent = useMemo(() => {
    if (!refreshing && loading) {
      return <StyledSpinner p="m" />;
    } else {
      return null;
    }
  }, [refreshing, loading]);

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  const setNotificationsCount = useSetAppStateValue('notificationsCount');
  const resetNotificationsCounter = useCallback(async () => {
    setNotificationsCount(0);
  }, [setNotificationsCount]);

  useFocusEffect(
    React.useCallback(() => {
      resetNotificationsCounter();
    }, [resetNotificationsCounter]),
  );

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <DView
      edges={['top', 'left', 'right']}
      scrollable={false}
      disableHideKeyboardTouchable={true}
      backgroundColor={theme.colors.white}
      style={styles.container}>
      <View
        style={{
          paddingHorizontal: theme.spacing.m,
          paddingBottom: theme.spacing.m,
        }}>
        <Typography.Semibold24>{t('activities')}</Typography.Semibold24>
      </View>
      {/* Notifications list */}
      <FlashList
        refreshControl={
          <RefreshControl
            tintColor={theme.colors.surfaceBlack}
            enabled
            onRefresh={refreshNotifications}
            refreshing={refreshing}
            progressViewOffset={Platform.OS === 'android' ? 80 : 0}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyActivities}
        data={items}
        renderItem={renderItem}
        ListFooterComponent={FooterComponent}
        estimatedItemSize={70}
        stickyHeaderIndices={stickyHeaderIndices}
        getItemType={item => {
          return typeof item === 'string' ? 'sectionHeader' : 'row';
        }}
        onEndReached={fetchMore}
      />
    </DView>
  );
};

export default Activities;
