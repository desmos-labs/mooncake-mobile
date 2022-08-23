import axios from 'axios';
import EnvConfig from 'config/EnvConfig';
import {getMMKV, MMKVKEYS} from 'lib/MMKVStorage';

const initializeAxiosInstance = () => {
  // Load previous auth token
  const bearerToken = getMMKV(MMKVKEYS.REST_AUTH_TOKEN);

  return axios.create({
    baseURL: EnvConfig.DESMOS_REST,
    timeout: 15000,
    headers: {
      Authorization: `bearer ${bearerToken}`,
    },
  });
};

const axiosInstance = initializeAxiosInstance();

export default axiosInstance;
