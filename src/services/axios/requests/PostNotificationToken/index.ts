import axiosInstance from 'services/axios';

/**
 * Get the address that will be used to sign/grant pre-authorized transactions.
 * For actual implementation and storage in state management, see src/recoil/butterConfigState.ts
 */
const PostNotificationToken = async (token: string): Promise<any> => {
  return axiosInstance.post('/notifications/tokens', {
    token,
  });
};

export default PostNotificationToken;
