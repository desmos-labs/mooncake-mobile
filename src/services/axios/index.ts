import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://57.128.144.235:43000',
  timeout: 15000,
});

export default axiosInstance;
