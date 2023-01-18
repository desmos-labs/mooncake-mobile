import {useQuery} from '@apollo/client';
import EnvConfig from 'config/EnvConfig';
import {differenceInCalendarDays, parseISO} from 'date-fns';
import _ from 'lodash';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import client from 'services/graphql/client';
import GetNotifications from 'services/graphql/queries/GetNotifications';
import GetPostBySubspaceIDandPostID from 'services/graphql/queries/GetPostBySubspaceIDandPostID';
import GetProfileForAddress from 'services/graphql/queries/GetProfileForAddress';
import NotificationTypesEnum from 'types/notificationTypes';

const useHooks = () => {
  const [notificationsWithProfile, setNotificationsWithProfile] = useState<
    any[]
  >([]);
  const [notificationsDetailsLoading, setNotificationsDetailsLoading] =
    useState(true);
  const {t} = useTranslation('activities');
  const [refetching, setRefetching] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const {
    data,
    loading: notificationsLoading,
    refetch: notificationsRefetch,
    fetchMore: notificationsFetchMore,
  } = useQuery(GetNotifications, {
    variables: {
      limit: 10,
      offset: 0,
    },
  });

  const getCorrectAddress = (notification: any) => {
    switch (notification.type) {
      case NotificationTypesEnum.Comment:
        return notification.data.comment_author;
      case NotificationTypesEnum.Follow:
        return notification.data.relationship_creator;
      case NotificationTypesEnum.Reply:
        return notification.data.reply_author;
      case NotificationTypesEnum.Reaction:
        return notification.data.reaction_author;
      case NotificationTypesEnum.InviteClaimed:
        return notification.data.claimer_address;
      case NotificationTypesEnum.InviteUnlocked:
        return notification.data.recipient;
      default:
        return '';
    }
  };

  const fetchNotificationDetails = useCallback(async () => {
    if (!data) return;
    try {
      const results = await Promise.all(
        data.notification.map(async (singleNot: any) => {
          const {data: profileData} = await client.query({
            query: GetProfileForAddress,
            variables: {
              address: getCorrectAddress(singleNot),
            },
            fetchPolicy: 'no-cache',
          });
          if (singleNot?.data?.post_id) {
            const {data: postData} = await client.query({
              query: GetPostBySubspaceIDandPostID,
              variables: {
                postID: singleNot.data.post_id,
                subspaceID: EnvConfig.APP_SUBSPACE_ID,
              },
              fetchPolicy: 'no-cache',
            });
            return {
              ...singleNot,
              profile: profileData.profile[0],
              post: postData.posts[0],
            };
          }
          return {...singleNot, profile: profileData.profile[0]};
        }),
      );
      if (results) {
        setNotificationsWithProfile(results);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setNotificationsDetailsLoading(false);
    }
  }, [JSON.stringify(data)]);

  const refetch = useCallback(async () => {
    setRefetching(true);
    await notificationsRefetch().finally(() =>
      setTimeout(() => setRefetching(false), 500),
    );
  }, [notificationsRefetch, fetchNotificationDetails]);

  const fetchMore = useCallback(
    async (distanceFromEnd: number) => {
      if (distanceFromEnd < 0) return;
      setFetchingMore(true);
      await notificationsFetchMore({
        variables: {
          offset: data.notification.length,
        },
        updateQuery: (prev, {fetchMoreResult}) => {
          if (!fetchMoreResult) {
            return prev;
          }
          return {
            ...prev,
            notification: [
              ...prev.notification,
              ...fetchMoreResult.notification,
            ],
          };
        },
      }).finally(() => setTimeout(() => setFetchingMore(false), 1000));
    },
    [data?.notification?.length, notificationsFetchMore],
  );

  useEffect(() => {
    fetchNotificationDetails();
  }, [fetchNotificationDetails]);

  const notificationsData: (string | any)[] = useMemo(() => {
    if (!notificationsWithProfile) return [];
    const sortedArray = _.orderBy(
      notificationsWithProfile,
      [obj => new Date(obj.timestamp)],
      ['desc'],
    );
    const thisWeekNotifications: any[] = [];
    const earlierNotifications: any[] = [];
    sortedArray.forEach(
      (singleNotification: {
        timestamp: any;
        data: any;
        user_address: string;
      }) => {
        const parsedTime = parseISO(`${singleNotification.timestamp!}Z`);
        if (-differenceInCalendarDays(new Date(parsedTime), Date.now()) <= 7) {
          thisWeekNotifications.push(singleNotification);
        } else {
          earlierNotifications.push(singleNotification);
        }
      },
    );
    if (thisWeekNotifications.length <= 0 && earlierNotifications.length > 0) {
      return [t('earlier'), ...earlierNotifications];
    } else if (
      thisWeekNotifications.length > 0 &&
      earlierNotifications.length <= 0
    ) {
      return [t('this week'), ...thisWeekNotifications];
    } else if (
      thisWeekNotifications.length > 0 &&
      earlierNotifications.length > 0
    ) {
      return [
        t('this week'),
        ...thisWeekNotifications,
        'divider',
        t('earlier'),
        ...earlierNotifications,
      ];
    } else {
      return [];
    }
  }, [notificationsWithProfile, t]);

  return {
    data,
    notificationsData,
    notificationsLoading,
    notificationsRefetch,
    notificationsFetchMore,
    notificationsDetailsLoading,
    refetch,
    refetching,
    fetchMore,
    fetchingMore,
  };
};

export default useHooks;
