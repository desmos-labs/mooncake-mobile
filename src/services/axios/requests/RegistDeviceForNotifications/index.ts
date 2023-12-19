import { promiseToResult } from 'lib/NeverThrowUtils';
import axiosInstance from 'services/axios';

const RegistDeviceForNotifications = (token: string) => {
  return promiseToResult(
    axiosInstance.post('/notifications/tokens', {
      token,
    }),
    'Failed to register device for notifications',
  );
};

export default RegistDeviceForNotifications;
