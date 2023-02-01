import axiosInstance from 'services/axios';

type Response = {
  nonce: string;
};

/**
 * Get a nonce, a uuid used to identify a login request
 */
const GetNonce = async (address: string): Promise<Response> => {
  const _response = await axiosInstance.get(`/nonce/${address}`);
  return _response.data;
};

export default GetNonce;
