import axiosInstance from 'services/axios';
import {ButterConfigState} from '@recoil/butterConfigState';

interface Response extends ButterConfigState {}

/**
 * Get the address that will be used to sign/grant pre-authorized transactions.
 * For actual implementation and storage in state management, see src/recoil/butterConfigState.ts
 */
const GetConfig = async (): Promise<Response> => {
  const _response = await axiosInstance.get('/config');

  return _response.data;
};

export default GetConfig;
