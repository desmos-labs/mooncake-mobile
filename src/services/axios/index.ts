import axios from 'axios';
import EnvConfig from 'config/EnvConfig';
import { deleteMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import React from 'react';

const axiosInstance = axios.create({
  baseURL: EnvConfig.BUTTER_REST,
  timeout: 15000,
});

/**
 * Updates the bearer token of the axios instance and also saves it to MMKV storage.
 */
export const updateAuthToken = (newToken: string) => {
  setMMKV(MMKVKEYS.REST_AUTH_TOKEN, newToken);

  axiosInstance.defaults.headers.common = {
    Authorization: `Bearer ${newToken}`,
  };
};

export const deleteAuthToken = () => {
  deleteMMKV(MMKVKEYS.REST_AUTH_TOKEN);

  axiosInstance.defaults.headers.common = {
    Authorization: '',
  };
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
