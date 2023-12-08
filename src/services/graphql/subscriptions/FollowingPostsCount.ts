import { gql } from '@apollo/client';

const FollowingPostsCount = gql`
  subscription PostAggregateSubscriptionFollowing($addresses: [String!]) @api(name: butter) {
    posts: post_aggregate(
      where: { _not: { conversation: {} }, author_address: { _in: $addresses } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export default FollowingPostsCount;
