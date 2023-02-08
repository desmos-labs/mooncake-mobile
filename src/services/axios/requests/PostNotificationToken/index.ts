import axiosInstance from 'services/axios';
import { err, ok, Result } from 'neverthrow';
import { HttpStatusCode } from 'axios';

/**
 * Save a notification token, used from Firebase to send notifications.
 */
const PostNotificationToken = async (token: string): Promise<Result<void, Error>> => {
  const response = await axiosInstance.post('/notifications/tokens', {
    token,
  });
  if (response.status !== HttpStatusCode.Ok) {
    return err(new Error(response.data));
  }
  return ok(undefined);
};

export default PostNotificationToken;
