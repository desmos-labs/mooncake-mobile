import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {FlashList} from '@shopify/flash-list';
import {errorImage} from 'assets/images';
import DView from 'components/DView';
import NotificationContentLoader from 'components/Loaders/NotificationContentLoader';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import {BottomTabsParamList} from 'navigation/RootNavigator/BottomTabs';
import ROUTES from 'navigation/routes';
import React, {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, Image, View} from 'react-native';
import {Divider, useTheme} from 'react-native-paper';
import NotificationComponent from 'screens/Activities/components/NotificationComponent';
import useHooks from './useHooks';
import useStyles from './useStyles';

type NavProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabsParamList, ROUTES.ACTIVITIES>,
  StackScreenProps<RootNavigatorParamList>
>;

export interface CompleteNotification {
  data: {
    /**
     * {NotificationsTypeEnum} Notification type
     */
    type: string;
    /**
     * Notification post id, could be an id of a comment, reply, or root post
     */
    post_id?: string;
  };
  /**
   * Profile of the notification author
   */
  profile?: any;
  /**
   * If follow notification, the author of the relationship
   */
  relationship_creator?: string;
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

  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(false);

  const stickyHeaderIndices = notificationsData
    .map((item, index) => {
      if (typeof item === 'string') {
        return index;
      } else {
        return null;
      }
    })
    .filter(item => item !== null) as number[];

  // TODO: refactor empty view when designer will create the new one
  const EmptyActivities = useMemo(() => {
    if (!data && !notificationsLoading) {
      return (
        <View style={styles.emptyView}>
          <Image
            source={errorImage}
            style={{
              width: 139,
              height: 163.55,
              resizeMode: 'cover',
            }}
          />
          <Typography.Body5>{t('no activities')}</Typography.Body5>
        </View>
      );
    }

    return null;
  }, [t, notificationsLoading]);

  const renderNotification = React.useCallback(({item}: string | any) => {
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
          profile={item.profile}
          post={item.post}
          timestamp={item.timestamp}
          navigation={navigation}
          data={item.data}
        />
      );
    }
  }, []);

  const footerComponent = useMemo(() => {
    if (fetchingMore) {
      return (
        <View style={{paddingHorizontal: theme.spacing.m}}>
          <NotificationContentLoader />
        </View>
      );
    } else {
      return null;
    }
  }, [fetchingMore]);

  if (
    !data ||
    data?.notification?.length === 0 ||
    !notificationsData ||
    notificationsData.length === 0 ||
    notificationsLoading ||
    !notificationsData
  ) {
    return (
      <View style={styles.flexCenter}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <DView
      edges={['top', 'left', 'right']}
      scrollable={false}
      disableHideKeyboardTouchable={true}
      backgroundColor={theme.colors.white}
      style={styles.container}>
      <View
        style={{
          backgroundColor: theme.colors.white,
          zIndex: 2,
          paddingHorizontal: theme.spacing.m,
        }}>
        <Typography.H3>{t('activities')}</Typography.H3>
      </View>
      <FlashList
        keyExtractor={(item, index) =>
          typeof item === 'string'
            ? `sectionHeader${index}`
            : `row${item.timestamp}`
        }
        refreshing={refetching}
        onRefresh={refetch}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyActivities}
        data={notificationsData}
        renderItem={renderNotification}
        ListFooterComponent={footerComponent}
        onEndReachedThreshold={0.5}
        estimatedItemSize={90}
        stickyHeaderIndices={stickyHeaderIndices}
        onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
        getItemType={item => {
          return typeof item === 'string' ? 'sectionHeader' : 'row';
        }}
        onEndReached={() => {
          if (!onEndReachedCalledDuringMomentum) {
            fetchMore(0);
            setOnEndReachedCalledDuringMomentum(true);
          }
        }}
      />
    </DView>
  );
};

export default Activities;
