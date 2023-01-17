import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {errorImage} from 'assets/images';
import DView from 'components/DView';
import NotificationContentLoader from 'components/Loaders/NotificationContentLoader';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import {BottomTabsParamList} from 'navigation/RootNavigator/BottomTabs';
import ROUTES from 'navigation/routes';
import React, {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  ListRenderItemInfo,
  SectionList,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
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

  // TODO: refactor empty view when designer will create the new one
  const EmptyActivities = useMemo(() => {
    if (
      notificationsData.length === 0 &&
      data?.notification?.length === 0 &&
      !refetching &&
      !fetchingMore
    ) {
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
  }, [data, notificationsLoading]);

  const renderNotification = React.useCallback(
    ({item}: ListRenderItemInfo<CompleteNotification>) => {
      return (
        <NotificationComponent
          profile={item.profile}
          post={item.post}
          timestamp={item.timestamp}
          navigation={navigation}
          data={item.data}
        />
      );
    },
    [navigation],
  );

  const footerComponent = useMemo(() => {
    if (fetchingMore) {
      return <NotificationContentLoader />;
    } else {
      return null;
    }
  }, [fetchingMore]);

  if (!data || notificationsLoading || !notificationsData) {
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
      <Typography.H3>{t('activities')}</Typography.H3>
      <SectionList
        keyExtractor={(item, index) =>
          String(`notificationKey${index + item.timestamp}`)
        }
        refreshing={refetching}
        onRefresh={refetch}
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyActivities}
        sections={notificationsData}
        renderItem={renderNotification}
        ListFooterComponent={footerComponent}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
        onEndReached={({distanceFromEnd}) => {
          if (!onEndReachedCalledDuringMomentum) {
            fetchMore(distanceFromEnd);
            setOnEndReachedCalledDuringMomentum(true);
          }
        }}
        renderSectionHeader={({section: {section}}) => (
          <View style={styles.sectionHeader}>
            <Typography.Button2>{section}</Typography.Button2>
          </View>
        )}
      />
    </DView>
  );
};

export default Activities;
