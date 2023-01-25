import notifee, {AndroidColor} from '@notifee/react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {FlashList} from '@shopify/flash-list';
import {errorImage} from 'assets/images';
import DView from 'components/DView';
import NotificationContentLoader from 'components/Loaders/NotificationContentLoader';
import TextRowContentLoader from 'components/Loaders/TextRowContentLoader';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import {MMKVKEYS, setMMKV} from 'lib/MMKVStorage';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import {BottomTabsParamList} from 'navigation/RootNavigator/BottomTabs';
import ROUTES from 'navigation/routes';
import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  Platform,
  RefreshControl,
  View,
} from 'react-native';
import {Divider, useTheme} from 'react-native-paper';
import NotificationComponent from 'screens/Activities/components/NotificationComponent';
import NotificationTypesEnum from 'types/notificationTypes';
import useHooks from './useHooks';
import useStyles from './useStyles';

type NavProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabsParamList, ROUTES.ACTIVITIES>,
  StackScreenProps<RootNavigatorParamList>
>;

export interface CompleteNotification {
  /**
   * Notification UUID
   */
  id?: string;
  /**
   * data object, containing notification fields
   */
  data: {
    /**
     * {NotificationsTypeEnum} Notification type
     */
    type: NotificationTypesEnum;
    /**
     * notification IDs
     * if post, only post_id
     * if comment/reply, only post_id and comment_id
     * if post reaction, only post_id
     * if comment reaction, only post_id and comment_id
     * if reply reaction, post_id comment_id and reply_id
     */
    post_id?: string;
    comment_id?: string;
    reply_id?: string;
    /**
     * subspace id, should not be undefined/null
     */
    subspace_id?: string;

    /**
     * If follow notification, the author of the relationship
     */
    relationship_creator?: string;
  };
  read_receipts: any[];
  /**
   * Profile of the notification author
   */
  profile?: any;

  /**
   * Complete post object
   */
  post?: any;
  /**
   * Notification timestamp
   */
  timestamp: string;
  /**
   * Navigation object, useful to navigate to the correct screen
   */
  navigation: any;
}

const Activities = () => {
  const {t} = useTranslation('activities');
  const theme = useTheme();
  const styles = useStyles();
  const navigation = useNavigation<NavProps>();
  const {
    data,
    notificationsData,
    fetchMore,
    refetch,
    refetching,
    fetchingMore,
    notificationsLoading,
  } = useHooks();

  const stickyHeaderIndices = notificationsData
    ?.map((item, index) => {
      if (typeof item === 'string') {
        return index;
      } else {
        return null;
      }
    })
    .filter(item => item !== null) as number[];

  const EmptyActivities = useMemo(() => {
    if (data && data.notification.length === 0 && !notificationsLoading) {
      return (
        <View style={styles.emptyView}>
          <Image source={errorImage} style={styles.errorImage} />
          <Typography.Body5>{t('no activities')}</Typography.Body5>
        </View>
      );
    }

    return null;
  }, [data, notificationsLoading]);

  const renderNotification = useCallback(({item}: string | any) => {
    if (typeof item === 'string') {
      if (item === 'divider') {
        return (
          <View style={styles.divider}>
            <Divider />
          </View>
        );
      }
      return (
        <View style={styles.sectionHeader}>
          <Typography.Button2>{item}</Typography.Button2>
        </View>
      );
    } else {
      return (
        <NotificationComponent
          id={item.id}
          profile={item.profile}
          post={item.post}
          timestamp={item.timestamp}
          navigation={navigation}
          data={item.data}
          read_receipts={item.read_receipts}
        />
      );
    }
  }, []);

  const footerComponent = useMemo(() => {
    if (fetchingMore) {
      return (
        <View style={{padding: theme.spacing.m}}>
          <ActivityIndicator color={theme.colors.surfaceBlack} />
        </View>
      );
    } else {
      return null;
    }
  }, [fetchingMore]);

  const resetNotificationsCounter = useCallback(async () => {
    await notifee.setBadgeCount(0);
    setMMKV(MMKVKEYS.NOTIFICATIONS_COUNT, 0);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      resetNotificationsCounter();
    }, [resetNotificationsCounter]),
  );

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
      {!notificationsLoading &&
      data?.notification.length > 0 &&
      notificationsData &&
      notificationsData.length > 0 ? (
        <FlashList
          keyExtractor={(item, index) =>
            typeof item === 'string'
              ? `sectionHeader${index}`
              : `row${item.id}${item.timestamp}`
          }
          refreshControl={
            <RefreshControl
              tintColor={theme.colors.surfaceBlack}
              colors={[AndroidColor.BLACK]}
              enabled
              onRefresh={refetch}
              refreshing={refetching}
              progressViewOffset={Platform.OS === 'android' ? 80 : 0}
            />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyActivities}
          data={notificationsData}
          renderItem={renderNotification}
          ListFooterComponent={footerComponent}
          estimatedItemSize={90}
          stickyHeaderIndices={stickyHeaderIndices}
          onEndReachedThreshold={0.5}
          getItemType={item => {
            return typeof item === 'string' ? 'sectionHeader' : 'row';
          }}
          onEndReached={fetchMore}
        />
      ) : (
        <View style={{margin: theme.spacing.m}}>
          <TextRowContentLoader width="90" />
          <Spacer paddingVertical={theme.spacing.s} />
          <NotificationContentLoader />
        </View>
      )}
    </DView>
  );
};

export default Activities;
