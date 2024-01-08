import { ResultAsync } from 'neverthrow';
import axiosInstance from 'services/axios';
import { promiseToResult } from 'lib/NeverThrowUtils';

const HidePost = (postID: number): ResultAsync<boolean, Error> => {
  return promiseToResult(
    axiosInstance.post(`/posts/${postID}/hide`),
    `Error hiding post ${postID}`,
  );
};

export default HidePost;
