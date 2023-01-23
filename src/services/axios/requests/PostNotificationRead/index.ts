import axiosInstance from 'services/axios';

/**
 * This endpoint allows to set a notification as read from a given user.
 */
const PostNotificationRead = async (notificationId: string): Promise<any> => {
  console.log('ID to clear', notificationId);
  return axiosInstance.post('/notifications/read', {
    notification_id: notificationId,
  });
};

export default PostNotificationRead;
