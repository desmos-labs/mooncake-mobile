import axiosInstance from 'services/axios';
import { err, ok, Result } from 'neverthrow';
import { HttpStatusCode } from 'axios';

/**
 * Refresh the user's token validity
 */
const RefreshSession = async (): Promise<Result<void, Error>> => {
  const response = await axiosInstance.post('/session');
  if (response.status !== HttpStatusCode.Ok) {
    return err(new Error(`Error while refreshing the session: ${response.data}`));
  }
  return ok(undefined);
};

export default RefreshSession;
