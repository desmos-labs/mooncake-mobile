import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.mainnet.butter.social',
  timeout: 15000,
});

export default axiosInstance;
