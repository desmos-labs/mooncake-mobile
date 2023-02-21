import { gql } from '@apollo/client';
import ProfileFields from 'services/graphql/queries/fragments/ProfilesFields';

const GetAccountFollowing = gql`
  ${ProfileFields}
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
      counterparty {
        ...ProfileFields
      }
    }
  }
`;

export default GetAccountFollowing;
