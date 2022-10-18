import axiosInstance from 'services/axios';

interface Response {
  cid: string;
  url: string;
}

/**
 * Get the address that will be used to sign/grant pre-authorized transactions.
 * For actual implementation and storage in state management, see src/recoil/butterConfigState.ts
 */
const PostProof = async (proof: any): Promise<Response> => {
  const _response = await axiosInstance.post('/proof', proof);

  return _response.data;
};

export default PostProof;
