import { promiseToResult } from 'lib/NeverThrowUtils';
import axiosInstance from 'services/axios';

/**
 * Function that performs a network request to initiate the user's account data deletion.
 */
const DeleteUserAccount = () => {
  return promiseToResult(
    axiosInstance.delete('/me'),
    "Unknown error while deleting the user's account",
  );
};

export default DeleteUserAccount;
