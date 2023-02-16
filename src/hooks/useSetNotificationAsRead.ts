import React from 'react';
import { CompleteNotification } from 'types/notifications';
import PostNotificationRead from 'services/axios/requests/PostNotificationRead';
import { ok, Result } from 'neverthrow';

/**
 * Hook that allows to set a {@link CompleteNotification} as ready by performing a call to the server.
 */
const useSetNotificationAsRead = () => {
  return React.useCallback(
    async (notification: CompleteNotification): Promise<Result<void, Error>> => {
      if (!notification.isRead) {
        return PostNotificationRead(notification.id);
      }
      return ok(undefined);
    },
    [],
  );
};

export default useSetNotificationAsRead;
