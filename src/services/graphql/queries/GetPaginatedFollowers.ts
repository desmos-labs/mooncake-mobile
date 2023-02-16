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
const GetPaginatedFollowers = gql`
  query GetPaginatedFollowers(
    $subspaceId: bigint!
    $userAddress: String!
    $limit: Int!
    $offset: Int!
  ) @api(name: butter) {
    paginatedFollowers: user_relationship(
      limit: $limit
      offset: $offset
      where: { subspace_id: { _eq: $subspaceId }, counterparty_address: { _eq: $userAddress } }
    ) {
      _: creator {
        address
        dtag
        profile_pic
        nickname
      }
    }
    user_relationship_aggregate(
      where: { subspace_id: { _eq: $subspaceId }, counterparty_address: { _eq: $userAddress } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export default GetPaginatedFollowers;
