import {gql} from '@apollo/client';

export type QueueData = {
  paginatedFollowers: PaginatedFollower[];
  user_relationship_aggregate: {
    aggregate: {
      count: number;
    };
  };
};

// @connection(key: "user_relationship", filter: ["where"])
/* A GraphQL query. */
const GetPaginatedFollowers = gql`
  query GetFollowers(
    $subspaceID: bigint!
    $userAddress: String!
    $limit: Int!
    $offset: Int!
  ) @api(name: desmos) {
    paginatedFollowers: user_relationship(
      limit: $limit
      offset: $offset
      where: {
        subspace_id: {_eq: $subspaceID}
        counterparty_address: {_eq: $userAddress}
        counterparty: {}
        creator: {}
      }
    ) {
      _: creator {
        address
        dtag
        profile_pic
        nickname
      }
    }
    user_relationship_aggregate(
      where: {
        subspace_id: {_eq: $subspaceID}
        counterparty_address: {_eq: $userAddress}
        counterparty: {}
        creator: {}
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export default GetPaginatedFollowers;
