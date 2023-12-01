import { promiseToResult } from 'lib/NeverThrowUtils';
import { ResultAsync } from 'neverthrow';
import axiosInstance from 'services/axios';

/**
 * Function that performs a network request to unlike a post.
 * @param postID - ID of the post to unlike.
 */
const UnlikePost = (postID: number): ResultAsync<void, Error> => {
  return promiseToResult(
    axiosInstance.delete(`/posts/${postID}/like`),
    `Error unliking post ${postID}`,
  );
};

export default UnlikePost;
