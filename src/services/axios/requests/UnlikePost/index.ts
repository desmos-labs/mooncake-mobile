import { promiseToResult } from 'lib/NeverThrowUtils';
import { ResultAsync } from 'neverthrow';
import axiosInstance from 'services/axios';

/**
 * Function that performs a network request to unlike a post.
 * @param postID - ID of the post to unlike.
 * @param abortSignal - Optional AbortSignal to cancel an ongoing network request
 * and prevent unnecessary work on the backend.
 */
const UnlikePost = (postID: number, abortSignal?: AbortSignal): ResultAsync<void, Error> => {
  return promiseToResult(
    axiosInstance.delete(`/posts/${postID}/like`, {
      signal: abortSignal,
    }),
    `Error unliking post ${postID}`,
  );
};

export default UnlikePost;
