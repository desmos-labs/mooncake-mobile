import axiosInstance from 'services/axios';

interface Response {
  tx_hash: string;
}

/**
 * This endpoint allows to accept an invite that has been sent by another user.
 */
const AcceptInvite = async (invite_code: string): Promise<Response> => {
  const _response = await axiosInstance.post('/invites/used', {invite_code});
  return _response.data;
};

export default AcceptInvite;
