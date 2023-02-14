import axiosInstance from 'services/axios';

/**
 * Given a username, returns the username if it exists, 400 if not.
 */
const CheckTwitterUsername = async (username: string): Promise<any> => {
  const _response = await axiosInstance.get(`/twitter/tweets/${username}`);
  return _response.data;
};

export default CheckTwitterUsername;
