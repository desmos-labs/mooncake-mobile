import { gql } from '@apollo/client';

const GetAccountAuthzGrants = gql`
  query GetAccountAuthzGrants($granteeAddress: String!, $granterAddress: String!)
  @api(name: desmos) {
    grants: authz_grant(
      where: {
        grantee_address: { _eq: $granteeAddress }
        granter_address: { _eq: $granterAddress }
      }
    ) {
      msg_type_url
      authorization
      expiration
    }
  }
`;

export default GetAccountAuthzGrants;
