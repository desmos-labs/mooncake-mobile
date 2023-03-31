import axiosInstance from 'services/axios';
import { ResultAsync } from 'neverthrow';

/**
 * Get a nonce, a uuid used to identify a login request
 */
const GetNonce = (address: string): ResultAsync<string, Error> => {
  return ResultAsync.fromPromise(axiosInstance.get(`/nonce/${address}`), (e: any) =>
    Error(e?.message ?? 'Error getting the nonce'),
  ).map(response => response.data);
};

export default GetNonce;
