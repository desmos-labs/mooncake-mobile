import axiosInstance from 'services/axios';
import { err, ok, Result } from 'neverthrow';
import { HttpStatusCode } from 'axios';

/**
 * This endpoint allows to set a notification as read from a given user.
 */
const PostNotificationRead = async (notificationId: string): Promise<Result<void, Error>> => {
  try {
    const result = await axiosInstance.post('/notifications/read', {
      notification_id: notificationId,
    });
    if (result.status !== HttpStatusCode.Ok) {
      return err(new Error('Error while setting the notification as read.'));
    }
    return ok(undefined);
  } catch (e: any) {
    return err(new Error(e));
  }
};

export default PostNotificationRead;
