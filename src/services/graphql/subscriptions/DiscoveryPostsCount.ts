import { gql } from '@apollo/client';

export const DiscoveryPostsCount = gql`
  subscription PostAggregateSubscription($subspaceID: bigint!, $userAddress: String!)
  @api(name: butter) {
    posts: post_aggregate(
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

export default DiscoveryPostsCount;
