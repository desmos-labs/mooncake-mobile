import { gql } from '@apollo/client';

/**
 * Query to fetch the list of fee grant allowance.
 */
export const GetAccountFeeGrantAllowance = gql`
  query GetAccountFeeGrantAllowance($granteeAddress: String) @api(name: forbole) {
    fee_grants: fee_grant_allowance(where: { grantee_address: { _eq: $granteeAddress } }) {
      allowance
      granterAddress: granter_address
    }
  }
`;

export default GetAccountFeeGrantAllowance;
