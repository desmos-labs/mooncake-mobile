import axiosInstance from 'services/axios';

/**
 * Save a notification token, used from Firebase to send notifications.
 */
const PostNotificationToken = async (token: string): Promise<any> => {
  return axiosInstance.post('/notifications/tokens', {
    token,
  });
};

export default PostNotificationToken;
