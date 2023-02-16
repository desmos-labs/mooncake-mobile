import { gql } from '@apollo/client';

const GetAccountAuthzGrants = gql`
  query UserAuthzGrants($granteeAddress: String!, $granterAddress: String!) @api(name: desmos) {
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

export interface GQLAuthzGrant {
  msg_type_url: string;
  expiration: string;
  authorization: {
    '@type': string;
    msg: string;
    subspaces_ids: string[];
  };
}

export interface GQLGetAccountAuthzGrants {
  grants: GQLAuthzGrant[];
}

export default GetAccountAuthzGrants;
