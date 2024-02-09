import { promiseToResult } from 'lib/NeverThrowUtils';
import axiosInstance from 'services/axios';

/**
 * Mark a notification as read.
 * @param id - id of the notification.
 */
const MarkNotificationAsRead = (id: string) => {
  return promiseToResult(
    axiosInstance.post(`/notifications/${id}/read`),
    'Error marking notification as read',
  );
};

export default MarkNotificationAsRead;
