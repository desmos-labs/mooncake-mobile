import { promiseToResult } from 'lib/NeverThrowUtils';
import { ResultAsync } from 'neverthrow';
import axiosInstance from 'services/axios';

/**
 * Function that performs a network request to like a post.
 * @param postID - ID of the post to like.
 */
const LikePost = (postID: number): ResultAsync<void, Error> => {
  return promiseToResult(
    axiosInstance.post(`/posts/${postID}/like`),
    `Error liking post ${postID}`,
  );
};

export default LikePost;
