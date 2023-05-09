import { ResultAsync } from 'neverthrow';
import axiosInstance from 'services/axios';

const HidePost = (postID: number): ResultAsync<boolean, Error> => {
  return ResultAsync.fromPromise(
    axiosInstance.post('/posts/hide', {
      post_id: postID,
    }),
    (e: any) => Error(e?.message ?? 'Error Hiding post'),
  ).map(response => response.status === 200);
};

export default HidePost;
