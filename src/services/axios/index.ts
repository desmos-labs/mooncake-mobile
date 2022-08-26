import axios from 'axios';
import EnvConfig from 'config/EnvConfig';
import {getMMKV, MMKVKEYS, setMMKV} from 'lib/MMKVStorage';
import RefreshSession from 'services/axios/requests/RefreshSession';

const axiosInstance = axios.create({
  baseURL: EnvConfig.DESMOS_REST,
  timeout: 15000,
});

/**
 * Load bearer token from storage.
 */
export const initializeAxiosInstance = async () => {
  // Load previous auth token

  const bearerToken = getMMKV(MMKVKEYS.REST_AUTH_TOKEN);

  axiosInstance.interceptors.response.use(
    response => response,
    error => {
      console.warn(`[AXIOS]: ${error}`);
      return error;
    },
  );
  // Don't do anything if bearerToken is not found
  if (!bearerToken) return;

  axiosInstance.defaults.headers.common.Authorization = `bearer ${bearerToken}`;

  await RefreshSession();
};

/**
 * Updates the bearer token of the axios instance and also saves it to MMKV storage.
 */
export const updateAuthToken = (newToken: string) => {
  setMMKV(MMKVKEYS.REST_AUTH_TOKEN, newToken);

  axiosInstance.defaults.headers.common.Authorization = `bearer ${newToken}`;
};

export default axiosInstance;
