import { gql } from '@apollo/client';

export const PostAggregateSubscription = gql`
  subscription PostAggregateSubscription($subspaceID: bigint!, $userAddress: String!)
  @api(name: butter) {
    post_aggregate(
      where: {
        subspace_id: { _eq: $subspaceID }
        _not: { conversation: {} }
        _and: { author_address: { _neq: $userAddress } }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const PostAggregateSubscriptionFollowing = gql`
  subscription PostAggregateSubscriptionFollowing($subspaceID: bigint!, $followingAddrs: [String]!)
  @api(name: butter) {
    post_aggregate(
      where: {
        subspace_id: { _eq: $subspaceID }
        _not: { conversation: {} }
        author_address: { _in: $followingAddrs }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;
