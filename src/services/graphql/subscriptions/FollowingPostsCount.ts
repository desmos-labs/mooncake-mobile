import { gql } from '@apollo/client';

const FollowingPostsCount = gql`
  subscription PostAggregateSubscriptionFollowing($subspaceId: bigint!, $addresses: [String]!)
  @api(name: butter) {
    posts: post_aggregate(
      where: {
        subspace_id: { _eq: $subspaceId }
        _not: { conversation: {} }
        author_address: { _in: $addresses }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export default FollowingPostsCount;
