import { gql } from '@apollo/client';

const GetAuthzGrants = gql`
  query UserAuthzGrants($userAddress: String!, $granterAddress: String!) @api(name: desmos) {
    grants: authz_grant(
      where: { grantee_address: { _eq: $userAddress }, granter_address: { _eq: $granterAddress } }
    ) {
      msg_type_url
      authorization
      expiration
    }
  }
`;

export default GetAuthzGrants;
