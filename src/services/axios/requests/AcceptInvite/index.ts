import axiosInstance from 'services/axios';
import { err, ok, Result } from 'neverthrow';

interface Response {
  txHash: string;
}

/**
 * This endpoint allows to accept an invitation that has been sent by another user.
 */
const AcceptInvite = async (invite_code: string): Promise<Result<Response, Error>> => {
  try {
    const response = await axiosInstance.post('/invites/used', { invite_code });
    return ok({
      txHash: response.data.tx_hash,
    });
  } catch (e: any) {
    return err(e);
  }
};

export default AcceptInvite;
