import { ResultAsync } from 'neverthrow';
import axiosInstance from 'services/axios';

/**
 * When a user joins the Bondscape application by creating a new account,
 * it might happen that account does not (yet) have any token needed in order to save the user's profile.
 * To solve this, the user can request a time and funds limited fee grant from our side in order to be able to pay for transaction fees and create their profile on-chain.
 */
const GetFeeGrant = (): ResultAsync<string, Error> => {
  return ResultAsync.fromPromise(
    axiosInstance.get('/feegrant'),
    (e: any) => e ?? Error('Error retrieving fee grant'),
  ).map(response => response.data);
};

export default GetFeeGrant;
