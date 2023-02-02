import axiosInstance from 'services/axios';

type Response = {
  user: {};
  tweets: [];
};

type Params = {
  username: string;
};

/**
 * Get the latest tweets made by a user, given its Twitter username
 */
const GetTweetsGivenAnUsername = async ({ username }: Params): Promise<Response> => {
  const _response = await axiosInstance.get(`/twitter/tweets/${username}`);
  return _response.data;
};

export default GetTweetsGivenAnUsername;
