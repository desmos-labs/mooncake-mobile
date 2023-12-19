import { err, ok } from 'neverthrow';
import React from 'react';
import MarkNotificationAsReaded from 'services/axios/requests/MakrNotificationAsReaded';

/**
 * Hook that provides a function to mark a notification as readed.
 */
const useMarkNotificationAsReaded = () => {
  return React.useCallback(async (id: string) => {
    const markResult = await MarkNotificationAsReaded(id);
    if (markResult.isErr()) {
      return err(markResult.error);
    }
    return ok(undefined);
  }, []);
};

export default useMarkNotificationAsReaded;
