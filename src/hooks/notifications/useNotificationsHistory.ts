import { useQuery } from '@apollo/client';
import _ from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import GetNotifications from 'services/graphql/queries/GetNotifications';
import { GqlGetNotificationsResult } from 'types/notifications';

/**
 * Hook that allows to get the notifications history of the current application user.
 */
const useNotificationsHistory = (_notificationsPerPage: number = 20) => {
  const [fetchingMore, setFetchingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, fetchMore, refetch } = useQuery<GqlGetNotificationsResult>(
    GetNotifications,
    {
      variables: {
        limit: _notificationsPerPage,
        offset: 0,
      },
    },
  );

  const notifications = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.notifications;
  }, [data]);

  const fetchMoreNotifications = useCallback(() => {
    if (fetchingMore) {
      return;
    }
    setFetchingMore(true);
    _.debounce(async () => {
      try {
        await fetchMore({
          variables: { offset: notifications.length },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult || fetchMoreResult.notifications.length === 0) {
              return prev;
            }

            return {
              notifications: [...prev.notifications, ...fetchMoreResult.notifications],
            };
          },
        });
      } catch (e: any) {
        console.log(e.toString());
      } finally {
        setFetchingMore(false);
      }
    }, 500)();
  }, [fetchMore, fetchingMore, notifications.length]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch({ offset: 0 });
    } catch (e: any) {
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return {
    notifications,
    loading,
    fetchMore: fetchMoreNotifications,
    fetchingMore,
    refresh,
    refreshing,
    error: undefined,
  };
};

export default useNotificationsHistory;
