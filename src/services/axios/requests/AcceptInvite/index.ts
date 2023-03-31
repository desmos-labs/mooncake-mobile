import axiosInstance from 'services/axios';
import { ResultAsync } from 'neverthrow';

interface Response {
  txHash: string;
}

/**
 * This endpoint allows to accept an invitation that has been sent by another user.
 */
const AcceptInvite = (invite_code: string): ResultAsync<Response, Error> => {
  return ResultAsync.fromPromise(
    axiosInstance.post('/invites/used', { invite_code }),

    // Safe to ignore, axios will raise an Error in case the request fails.
    // @ts-ignore
    e => Error(e?.message ?? 'Error performing the login'),
  ).map(response => ({
    txHash: response.data.tx_hash,
  }));
};

export default AcceptInvite;
