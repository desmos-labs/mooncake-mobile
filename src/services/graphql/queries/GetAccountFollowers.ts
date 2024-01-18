import { gql } from '@apollo/client';
import RelationshipFields from 'services/graphql/queries/fragments/RelationshipFields';

const GetAccountFollowers = gql`
  ${RelationshipFields}
  query GetPaginatedFollowers(
    $subspaceId: bigint!
    $userAddress: String!
    $limit: Int!
    $offset: Int!
  ) @api(name: desmos) {
    relationships: user_relationship(
      where: {
        creator: { dtag: { _is_null: false } }
        subspace_id: { _eq: $subspaceId }
        counterparty_address: { _eq: $userAddress }
      }
      limit: $limit
      offset: $offset
    ) {
      ...RelationshipFields
    }
  }
`;

export default GetAccountFollowers;
