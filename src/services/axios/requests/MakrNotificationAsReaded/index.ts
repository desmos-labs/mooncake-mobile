import { promiseToResult } from 'lib/NeverThrowUtils';
import axiosInstance from 'services/axios';

/**
 * Mark a notification as readed.
 * @param id - id of the notification.
 */
const MarkNotificationAsReaded = (id: string) => {
  return promiseToResult(
    axiosInstance.post(`/notifications/${id}/read`),
    'Error marking notification as read',
  );
};

export default MarkNotificationAsReaded;
