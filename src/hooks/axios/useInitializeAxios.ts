import { useActiveAccountAddress } from '@recoil/accounts';
import { HttpStatusCode } from 'axios';
import useCustomToast from 'hooks/extended/useCustomToast';
import usePerformLogout from 'hooks/user/usePerformLogout';
import { useEffect } from 'react';
import axiosInstance from 'services/axios';

/**
 * A hook that augments the interceptors of the axiosInstance with react hook functionality.
 */
const useInitializeAxios = () => {
  const performLogout = usePerformLogout();
  const activeAccountAddress = useActiveAccountAddress();
  const toast = useCustomToast();

  useEffect(() => {
    // To prevent duplicate interceptors, clear them in order to avoid issues.
    // This situation can occur if the useEffect is triggered multiple times, such as when there are changes
    // in activeAccountAddress or performLogin, or during application refresh while in development mode.
    axiosInstance.interceptors.response.clear();

    // Register a response interceptor to make sure that we properly handle unauthorized responses.
    axiosInstance.interceptors.response.use(
      response => response,
      async error => {
        if (activeAccountAddress && error.response?.status === HttpStatusCode.Unauthorized) {
          console.log('[AXIOS]: Unauthorized response, logging out.');
          await performLogout();
          toast.errorNoRetry('You have been logged out. Please log in again');
        }
        console.log(error);
        const errorMsg = error.response?.data?.error ?? error.response?.data ?? 'Unknown error';
        console.warn('[AXIOS]: ', errorMsg.charAt(0).toUpperCase() + errorMsg.slice(1));
        return Promise.reject(new Error(errorMsg));
      },
    );
  }, [activeAccountAddress, performLogout]);
};

export default useInitializeAxios;
