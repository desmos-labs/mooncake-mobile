import { gql } from '@apollo/client';

export type QueueData = {
  paginatedFollowers: PaginatedFollower[];
  user_relationship_aggregate: {
    aggregate: {
      count: number;
    };
  };
};

/* A GraphQL query. */
const GetPaginatedFollowing = gql`
  query GetPaginatedFollowing(
    $subspaceId: bigint!
    $userAddress: String!
    $limit: Int!
    $offset: Int!
  ) @api(name: butter) {
    paginatedFollowers: user_relationship(
      limit: $limit
      offset: $offset
      where: { subspace_id: { _eq: $subspaceId }, creator_address: { _eq: $userAddress } }
    ) {
      _: counterparty {
        address
        dtag
        profile_pic
        nickname
      }
    }
    user_relationship_aggregate(
      where: { subspace_id: { _eq: $subspaceId }, creator_address: { _eq: $userAddress } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export default GetPaginatedFollowing;
