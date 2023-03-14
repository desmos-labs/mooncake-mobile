import notifee, { AndroidColor } from '@notifee/react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { errorImage } from 'assets/images';
import DView from 'components/DView';
import NotificationContentLoader from 'components/Loaders/NotificationContentLoader';
import TextRowContentLoader from 'components/Loaders/TextRowContentLoader';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, Platform, RefreshControl, View } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import NotificationComponent from 'screens/Activities/components/NotificationItem';
import useNotificationsHistory from 'hooks/notifications/useNotificationsHistory';
import { CompleteNotification } from 'types/notifications';
import { useSetAppStateValue } from '@recoil/appState';
import { useKeyExtractor, useSplitNotificationsByWeek } from './hooks';
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
    loading: areNotificationsLoading,
    fetchMore,
    fetchingMore,
    refresh: refreshNotifications,
    refreshing,
  } = useNotificationsHistory();

  const splitNotificationsByWeek = useSplitNotificationsByWeek();
  const keyExtractor = useKeyExtractor();

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
    if (areNotificationsLoading || notifications.length > 0) {
      return;
    }
    return (
      <View style={styles.emptyView}>
        <Image source={errorImage} style={styles.errorImage} />
        <Typography.Body5>{t('no activities')}</Typography.Body5>
      </View>
    );
  }, [areNotificationsLoading, notifications.length, styles.emptyView, styles.errorImage, t]);

  // Function that is used in order to render each item within the list
  const renderItem = useCallback(
    (info: ListRenderItemInfo<CompleteNotification | string>) => {
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
            <Typography.Button2>{item}</Typography.Button2>
          </View>
        );
      }

      // Render a notification
      return <NotificationComponent notification={item} />;
    },
    [styles.divider, styles.sectionHeader],
  );

  // Component shown at the bottom tof the page
  const FooterComponent = useMemo(() => {
    if (fetchingMore) {
      return (
        <View style={{ padding: theme.spacing.m }}>
          <ActivityIndicator color={theme.colors.surfaceBlack} />
        </View>
      );
    } else {
      return null;
    }
  }, [fetchingMore, theme.colors.surfaceBlack, theme.spacing.m]);

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  const setNotificationsCount = useSetAppStateValue('notificationsCount');
  const resetNotificationsCounter = useCallback(async () => {
    setNotificationsCount(0);
    await notifee.setBadgeCount(0);
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
        }}>
        <Typography.H3>{t('activities')}</Typography.H3>
      </View>

      {/* Notifications list */}
      {!areNotificationsLoading && notifications ? (
        <FlashList
          keyExtractor={keyExtractor}
          refreshControl={
            <RefreshControl
              tintColor={theme.colors.surfaceBlack}
              colors={[AndroidColor.BLACK]}
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
          estimatedItemSize={90}
          stickyHeaderIndices={stickyHeaderIndices}
          onEndReachedThreshold={0.5}
          getItemType={item => {
            return typeof item === 'string' ? 'sectionHeader' : 'row';
          }}
          onEndReached={fetchMore}
        />
      ) : (
        <View style={{ margin: theme.spacing.m }}>
          <TextRowContentLoader width="90" />
          <Spacer paddingVertical={theme.spacing.s} />
          <NotificationContentLoader />
        </View>
      )}
    </DView>
  );
};

export default Activities;
