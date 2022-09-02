import {gql} from '@apollo/client';
import {PROFILE_SUMMARY_FIELDS} from '../fragments';

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
  ${PROFILE_SUMMARY_FIELDS}
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
    ) {
      _: counterparty {
        ...ProfileSummaryFields
      }
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
