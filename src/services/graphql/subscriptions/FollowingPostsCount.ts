import { gql } from '@apollo/client';

export const FollowingPostsCount = gql`
  subscription PostAggregateSubscriptionFollowing($subspaceID: bigint!, $addresses: [String]!)
  @api(name: butter) {
    posts: post_aggregate(
      where: {
        subspace_id: { _eq: $subspaceID }
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
