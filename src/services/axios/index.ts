import axios from 'axios';
import EnvConfig from 'config/EnvConfig';
import {getMMKV, MMKVKEYS, setMMKV} from 'lib/MMKVStorage';

const axiosInstance = axios.create({
  baseURL: EnvConfig.DESMOS_REST,
  timeout: 15000,
});

/**
 * Load bearer token from storage.
 */
export const initializeAxiosInstance = () => {
  // Load previous auth token
  const bearerToken = getMMKV(MMKVKEYS.REST_AUTH_TOKEN);

  // Don't do anything if bearerToken is not found
  if (!bearerToken) return;

  axiosInstance.defaults.headers.common.Authorization = `bearer ${bearerToken}`;
};

/**
 * Updates the bearer token of the axios instance and also saves it to MMKV storage.
 */
export const updateAuthToken = (newToken: string) => {
  setMMKV(MMKVKEYS.REST_AUTH_TOKEN, newToken);

  axiosInstance.defaults.headers.common.Authorization = `bearer ${newToken}`;
};

export default axiosInstance;
