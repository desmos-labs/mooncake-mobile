import React from 'react';

/**
 * Hook that allows to get the notifications history of the current application user.
 */
const useNotificationsHistory = (_notificationsPerPage: number = 20) => {
  // TODO: Implement the notification history fetch logic.
  return {
    notifications: [],
    loading: false,
    fetchMore: React.useCallback(() => {}, []),
    fetchingMore: React.useCallback(() => {}, []),
    refresh: React.useCallback(() => {}, []),
    refreshing: false,
    error: undefined,
  };
};

export default useNotificationsHistory;
