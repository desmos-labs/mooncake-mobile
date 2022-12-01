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
  const {
    data,
    loading: notificationsLoading,
    refetch: notificationsRefetch,
    fetchMore: notificationsFetchMore,
  } = useQuery(GetNotifications, {
    variables: {
      limit: 7,
      offset: 0,
    },
  });

  const getCorrectAddress = (notification: any) => {
    switch (notification.data.type) {
      case NotificationTypesEnum.Comment:
        return notification.data.comment_author;
      case NotificationTypesEnum.Follow:
        return notification.data.relationship_creator;
      case NotificationTypesEnum.Reply:
        return notification.data.reply_author;
      case NotificationTypesEnum.Reaction:
        return notification.data.reaction_author;
      default:
        return '';
    }
  };

  const fetchNotificationDetails = useCallback(async () => {
    if (data) {
      try {
        setNotificationsDetailsLoading(true);
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
    }
  }, [data]);

  useEffect(() => {
    fetchNotificationDetails();
  }, [fetchNotificationDetails]);

  const notificationsData: [] | {data: any[]; section: string}[] =
    useMemo(() => {
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
          if (differenceInCalendarDays(new Date(parsedTime), Date.now()) <= 7) {
            thisWeekNotifications.push(singleNotification);
          } else {
            earlierNotifications.push(singleNotification);
          }
        },
      );
      if (
        thisWeekNotifications.length <= 0 &&
        earlierNotifications.length > 0
      ) {
        return [{section: t('earlier'), data: earlierNotifications}];
      } else if (
        thisWeekNotifications.length > 0 &&
        earlierNotifications.length <= 0
      ) {
        return [{section: t('this week'), data: thisWeekNotifications}];
      } else if (
        thisWeekNotifications.length > 0 &&
        earlierNotifications.length > 0
      ) {
        return [
          {section: t('this week'), data: thisWeekNotifications},
          {section: t('earlier'), data: earlierNotifications},
        ];
      } else {
        return [];
      }
    }, [notificationsWithProfile, t]);

  const globalLoading = notificationsLoading || notificationsDetailsLoading;

  return {
    data,
    notificationsData,
    globalLoading,
    notificationsLoading,
    notificationsRefetch,
    notificationsFetchMore,
  };
};

export default useHooks;
