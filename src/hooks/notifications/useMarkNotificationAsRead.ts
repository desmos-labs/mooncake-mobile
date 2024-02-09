import { err, ok } from 'neverthrow';
import React from 'react';
import MarkNotificationAsRead from 'services/axios/requests/MakrNotificationAsReaded';

/**
 * Hook that provides a function to mark a notification as read.
 */
const useMarkNotificationAsRead = () => {
  return React.useCallback(async (id: string) => {
    const markResult = await MarkNotificationAsRead(id);
    if (markResult.isErr()) {
      return err(markResult.error);
    }
    return ok(undefined);
  }, []);
};

export default useMarkNotificationAsRead;
