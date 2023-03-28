import { gql } from '@apollo/client';

/**
 * Query to fetch the list of fee grant allowance.
 */
export const GetAccountFeeGrantAllowance = gql`
  query GetAccountFeeGrantAllowance($granteeAddress: String, $granterAddress: String)
  @api(name: desmos) {
    fee_grants: fee_grant(
      where: {
        grantee_address: { _eq: $granteeAddress }
        granter_address: { _eq: $granterAddress }
      }
    ) {
      expiration_date
      allowance
    }
  }
`;

export default GetAccountFeeGrantAllowance;
