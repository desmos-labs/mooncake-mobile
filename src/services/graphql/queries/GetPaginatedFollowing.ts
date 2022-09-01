import {gql} from '@apollo/client';
import {PAGINATED_FOLLOWING} from '../fragments';

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
  ${PAGINATED_FOLLOWING}
  query GetFollowing(
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
        creator_address: {_eq: $userAddress}
        creator: {}
        counterparty: {}
      }
      order_by: {counterparty: {creation_time: desc}}
    )
      @connection(
        key: "user_relationship"
        filter: ["where", ["subspace_id", "creator_address"]]
      ) {
      ...PaginatedFollowingFields
    }
    user_relationship_aggregate(
      where: {
        subspace_id: {_eq: $subspaceID}
        creator_address: {_eq: $userAddress}
        creator: {}
        counterparty: {}
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export default GetPaginatedFollowing;
