import { gql } from '@apollo/client';

const GetFeeGrantCount = gql`
  query UserFeeGrants($userAddress: String!, $granterAddress: String!) @api(name: desmos) {
    grants: fee_grant_aggregate(
      where: { granter_address: { _eq: $granterAddress }, grantee_address: { _eq: $userAddress } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export default GetFeeGrantCount;
