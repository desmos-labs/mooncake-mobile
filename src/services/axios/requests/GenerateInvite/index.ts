import axiosInstance from 'services/axios';

interface Response {
  code: string;
  link: string;
  expiration_time: string;
}

/**
 * This endpoint allows you to generate a new invite that can later be shared with other users
 */
const GenerateInvite = async (): Promise<Response> => {
  const _response = await axiosInstance.post('/invites');
  return _response.data;
};

export default GenerateInvite;
