import { Result, ResultAsync } from 'neverthrow';
import axiosInstance from 'services/axios';

/**
 * Refresh the user's token validity
 */
const RefreshSession = async (): Promise<Result<string, Error>> => {
  return ResultAsync.fromPromise(
    axiosInstance.post('/session'),
    (e: any) => e ?? Error('Error refreshing the session'),
  );
};

export default RefreshSession;
