import axiosInstance from 'services/axios';
import {GrantEnums} from 'lib/desmos/msgtypes';

type Params = {
  /**
   * The address of the user to check grants for.
   */
  address: string;
};

type Response = {
  /**
   * The user's address/
   */
  user: string;

  /**
   * Whether the user has given authorization for fee grants.
   */
  has_fee_grant: boolean;

  /**
   * An array of grants the user has given.
   */
  grants: GrantEnums[];
};

/**
 * API call to get active grants and fee grant status of an address.
 * @param {Object} Params - An object containing the address to check grants for.
 * @param {string} Object.address - The address to check grants for
 * @returns {Promise<Response>} - A Promise that resolves to the Response type above.
 */
const GetActiveGrants = async ({address}: Params): Promise<Response> => {
  const _response = await axiosInstance.get(`/grants/${address}`);

  return _response.data;
};

export default GetActiveGrants;
