import axios from 'axios';
import Constants from 'config/Constants';

const axiosInstance = axios.create({
  baseURL: Constants.apiEndpoint,
  timeout: 15000,
});

export default axiosInstance;
