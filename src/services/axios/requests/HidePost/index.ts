import { ResultAsync } from 'neverthrow';
import axiosInstance from 'services/axios';
import { promiseToResult } from 'lib/NeverThrowUtils';
import { HttpStatusCode } from 'axios';

const HidePost = (postID: number): ResultAsync<boolean, Error> => {
  return promiseToResult(
    axiosInstance.post(`/posts/${postID}/hide`),
    `Error hiding post ${postID}`,
  ).map(response => response.status === HttpStatusCode.Ok);
};

export default HidePost;
