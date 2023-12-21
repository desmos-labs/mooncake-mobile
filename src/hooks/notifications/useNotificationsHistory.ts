import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';
import { FetchDataFunction, usePaginatedData } from 'hooks/usePaginatedData';
import React from 'react';
import GetNotifications from 'services/graphql/queries/GetNotifications';
import { GqlGetNotificationsResult, Notification } from 'types/notifications';

/**
 * Hook that provides a function that can be used from the usePaginatedData hook
 * to fetch the notifications.
 */
const useFetchNotifications = () => {
  const [getNotifications] = useCustomLazyQuery<GqlGetNotificationsResult>(GetNotifications);

  return React.useCallback<FetchDataFunction<Notification, Date>>(
    async (offset, limit, filter) => {
      const data = await getNotifications({
        query: GetNotifications,
        fetchPolicy: 'network-only',
        variables: {
          startDate: filter!.toISOString(),
          limit,
          offset,
        },
      });

      const safeNotifications: Notification[] = data?.notifications ?? [];

      return {
        data: safeNotifications,
        endReached: safeNotifications.length < limit,
      };
    },
    [getNotifications],
  );
};

/**
 * Hook that allows to get the notifications history of the current application user.
 */
const useNotificationsHistory = (_notificationsPerPage: number = 20) => {
  const fetchNotifications = useFetchNotifications();
  const [lastFetchTimestamp, setLastFetchTimestamp] = React.useState(new Date());
  const { data, loading, updateFilter, ...otherFields } = usePaginatedData(fetchNotifications, {
    itemsPerPage: 20,
    initialFilter: lastFetchTimestamp,
    autoFetchFirstPage: true,
  });

  const refetch = React.useCallback(async () => {
    // Since here we use a filter to define the start date from which
    // the notification will be fetched, we use the update filter fucntion
    // to trigger a refetch.
    const newDate = new Date();
    setLastFetchTimestamp(newDate);
    updateFilter(newDate, true);
  }, [updateFilter]);

  return {
    notifications: data,
    loading,
    refetch,
    ...otherFields,
  };
};

export default useNotificationsHistory;
