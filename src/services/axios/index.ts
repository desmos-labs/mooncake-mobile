import { useSetAppStateValue } from '@recoil/appState';
import axios from 'axios';
import React from 'react';

const axiosInstance = axios.create({
  baseURL: 'https://apis.testnet.butter.social',
  timeout: 15000,
});

/**
 * Updates the bearer token of the axios instance and also saves it to MMKV storage.
 */
export const useUpdateAuthToken = () => {
  const setToken = useSetAppStateValue('bearerToken');
  return React.useCallback(
    (newToken: string) => {
      setToken(value => {
        // Only update the token if the new one is not empty
        const tokenValue = newToken.length > 0 ? newToken : value;
        axiosInstance.defaults.headers.common = {
          Authorization: `Bearer ${tokenValue}`,
        };
        return tokenValue;
      });
    },
    [setToken],
  );
};

export const useDeleteAuthToken = () => {
  const setToken = useSetAppStateValue('bearerToken');
  return React.useCallback(() => {
    setToken('');
    axiosInstance.defaults.headers.common = {
      Authorization: '',
    };
  }, [setToken]);
};

/**
 * A hook that augments the interceptors of the axiosInstance with react hook functionality.
 */
export const useInitializeAxios = () => {
  React.useEffect(() => {
    axiosInstance.interceptors.response.use(
      response => response,
      error => {
        const responseMsg = error.response?.data ?? error.toString();
        console.warn(`[AXIOS]: ${responseMsg}`);
        throw new Error(responseMsg);
      },
    );
  }, []);
};

export default axiosInstance;
