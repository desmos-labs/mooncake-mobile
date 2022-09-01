import {gql} from '@apollo/client';
import {PAGINATED_FOLLOWERS} from '../fragments';

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
  ${PAGINATED_FOLLOWERS}
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
      order_by: {creator: {creation_time: desc}}
    )
      @connection(
        key: "user_relationship"
        filter: ["where", ["subspace_id", "counterparty_address"]]
      ) {
      ...PaginatedFollowersFields
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
