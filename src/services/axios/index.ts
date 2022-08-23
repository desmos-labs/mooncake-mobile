import axios from 'axios';
import EnvConfig from 'config/EnvConfig';
import {getMMKV, MMKVKEYS} from 'lib/MMKVStorage';

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

  if (bearerToken) {
    axiosInstance.defaults.headers.common.Authorization = `bearer ${bearerToken}`;
  }
};

export default axiosInstance;
