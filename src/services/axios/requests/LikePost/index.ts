import { promiseToResult } from 'lib/NeverThrowUtils';
import { ResultAsync } from 'neverthrow';
import axiosInstance from 'services/axios';

/**
 * Function that performs a network request to like a post.
 * @param postID - ID of the post to like.
 * @param abortSignal - Optional AbortSignal to cancel an ongoing network request
 * and prevent unnecessary work on the backend.
 */
const LikePost = (postID: number, abortSignal?: AbortSignal): ResultAsync<void, Error> => {
  return promiseToResult(
    axiosInstance.post(`/posts/${postID}/like`, {
      signal: abortSignal,
    }),
    `Error liking post ${postID}`,
  );
};

export default LikePost;
