import React from 'react';
import { NotificationData } from 'types/notifications';

/**
 * Hook that provides a function to navigate to the screen
 * corresponding to a notification.
 */
const useHandleNotificationNavigation = () => {
  return React.useCallback((notficationData: NotificationData) => {
    console.log('[Notification] Navigation for', notficationData);
  }, []);
};

export default useHandleNotificationNavigation;
