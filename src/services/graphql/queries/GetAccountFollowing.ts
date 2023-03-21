import { gql } from '@apollo/client';
import RelationshipFields from 'services/graphql/queries/fragments/RelationshipFields';

const GetAccountFollowing = gql`
  ${RelationshipFields}
  query GetPaginatedFollowing(
    $subspaceId: bigint!
    $userAddress: String!
    $limit: Int!
    $offset: Int!
  ) @api(name: butter) {
    following: user_relationship(
      where: { subspace_id: { _eq: $subspaceId }, creator_address: { _eq: $userAddress } }
      offset: $offset
      limit: $limit
    ) {
      ...RelationshipFields
    }
  }
`;

export default GetAccountFollowing;
