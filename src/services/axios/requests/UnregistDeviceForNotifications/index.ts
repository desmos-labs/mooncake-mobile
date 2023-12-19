import { promiseToResult } from 'lib/NeverThrowUtils';
import axiosInstance from 'services/axios';

const UnregistDeviceForNotifications = (token: string) => {
  return promiseToResult(
    axiosInstance.delete(`/notifications/tokens/${token}`),
    'Failed to unregister device for notifications',
  );
};

export default UnregistDeviceForNotifications;
