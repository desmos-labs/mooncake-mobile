import { gql } from '@apollo/client';

const DiscoveryPostsCount = gql`
  subscription PostAggregateSubscription($userAddress: String!) @api(name: butter) {
    posts: post_aggregate(
      where: { _not: { conversation: {} }, _and: { author_address: { _neq: $userAddress } } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export default DiscoveryPostsCount;
