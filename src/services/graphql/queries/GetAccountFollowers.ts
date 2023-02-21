import { gql } from '@apollo/client';
import ProfileFields from 'services/graphql/queries/fragments/ProfilesFields';

const GetAccountFollowers = gql`
  ${ProfileFields}
  query GetPaginatedFollowers(
    $subspaceId: bigint!
    $userAddress: String!
    $limit: Int!
    $offset: Int!
  ) @api(name: butter) {
    relationships: user_relationship(
      where: { subspace_id: { _eq: $subspaceId }, counterparty_address: { _eq: $userAddress } }
      limit: $limit
      offset: $offset
    ) {
      creator {
        ...ProfileFields
      }
    }
  }
`;

export default GetAccountFollowers;
