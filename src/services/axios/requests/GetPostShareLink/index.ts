import { ResultAsync } from 'neverthrow';
import axiosInstance from 'services/axios';

/**
 * Gets the post link to share with other users.
 */
const GetPostShareLink = (postId: number): ResultAsync<string, Error> => {
  return ResultAsync.fromPromise(axiosInstance.get(`/posts/${postId}/links/details`), (e: any) =>
    Error(e?.message ?? 'Error getting the post share link'),
  ).map(response => response.data);
};

export default GetPostShareLink;
