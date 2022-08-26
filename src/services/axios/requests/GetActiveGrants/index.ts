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

const GetActiveGrants = async ({address}: Params): Promise<Response> => {
  const _response = await axiosInstance.get(`/grants/${address}`);

  return _response.data;
};

export default GetActiveGrants;
