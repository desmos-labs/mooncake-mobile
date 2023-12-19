import { useFocusEffect } from '@react-navigation/native';
import { useSetAppStateValue } from '@recoil/appState';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { emptyListPlaceholder } from 'assets/images';
import DView from 'components/DView';
import ActivitiesListContentLoader from 'components/Loaders/ActivitiesListContentLoader';
import StyledSpinner from 'components/StyledSpinner';
import Typography from 'components/Typography';
import useNotificationsHistory from 'hooks/notifications/useNotificationsHistory';
import { Divider, useTheme } from 'native-base';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Platform, RefreshControl, View } from 'react-native';
import NotificationComponent from 'screens/Activities/components/NotificationItem';
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
    loading,
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
    if (loading || notifications.length > 0) {
      return;
    }
    return (
      <View style={styles.emptyView}>
        <Image source={emptyListPlaceholder} style={styles.errorImage} />
        <Typography.Body6>{t('no activities')}</Typography.Body6>
      </View>
    );
  }, [loading, notifications.length, styles.emptyView, styles.errorImage, t]);

  // Function that is used in order to render each item within the list
  const renderItem = useCallback(
    (info: ListRenderItemInfo<any | string>) => {
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
            <Typography.Button2>{t(item)}</Typography.Button2>
          </View>
        );
      }

      // Render a notification
      return <NotificationComponent notification={item} />;
    },
    [styles.divider, styles.sectionHeader, t],
  );

  // Component shown at the bottom tof the page
  const FooterComponent = useMemo(() => {
    if (fetchingMore) {
      return <StyledSpinner p="m" />;
    } else {
      return null;
    }
  }, [fetchingMore]);

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
        <Typography.H3>{t('activities')}</Typography.H3>
      </View>
      {/* Notifications list */}
      {!loading ? (
        <FlashList
          keyExtractor={keyExtractor}
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
          estimatedItemSize={90}
          stickyHeaderIndices={stickyHeaderIndices}
          getItemType={item => {
            return typeof item === 'string' ? 'sectionHeader' : 'row';
          }}
          onEndReached={fetchMore}
        />
      ) : (
        <View style={{ margin: theme.spacing.m }}>
          <ActivitiesListContentLoader />
        </View>
      )}
    </DView>
  );
};

export default Activities;
