import {gql} from '@apollo/client';

export type QueueData = {
  user_relationship: Array<{
    _: FollowersData;
  }>;
  user_relationship_aggregate: {
    aggregate: {
      count: number;
    };
  };
};

/* A GraphQL query. */
export const GetFollowingForAddress = gql`
  query GetFollowingForAddress(
    $subspaceID: bigint!
    $userAddress: String!
    $limit: Int!
    $offset: Int!
  ) @api(name: desmos) {
    user_relationship(
      limit: $limit
      offset: $offset
      where: {
        subspace_id: {_eq: $subspaceID}
        creator_address: {_eq: $userAddress}
      }
      order_by: {counterparty: {creation_time: asc}}
    ) {
      _: counterparty {
        dtag
        nickname
        profile_pic
        address
      }
    }
    user_relationship_aggregate(
      where: {counterparty_address: {_eq: $userAddress}}
    ) {
      aggregate {
        count
      }
    }
  }
`;

/* A GraphQL query. */
export const GetFollowersForAddress = gql`
  query GetFollowersForAddress(
    $subspaceID: bigint!
    $userAddress: String!
    $limit: Int!
    $offset: Int!
  ) @api(name: desmos) {
    user_relationship(
      limit: $limit
      offset: $offset
      where: {
        subspace_id: {_eq: $subspaceID}
        counterparty_address: {_eq: $userAddress}
      }
      order_by: {creator: {creation_time: asc}}
    ) {
      _: creator {
        dtag
        nickname
        profile_pic
        address
      }
    }
    user_relationship_aggregate(
      where: {counterparty_address: {_eq: $userAddress}}
    ) {
      aggregate {
        count
      }
    }
  }
`;
