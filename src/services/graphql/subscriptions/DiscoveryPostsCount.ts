import { gql } from '@apollo/client';

const DiscoveryPostsCount = gql`
  subscription PostAggregateSubscription($subspaceId: bigint!, $userAddress: String!)
  @api(name: butter) {
    posts: post_aggregate(
      where: {
        subspace_id: { _eq: $subspaceId }
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
