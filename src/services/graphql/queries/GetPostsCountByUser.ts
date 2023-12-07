import { gql } from '@apollo/client';

const GetPostsCountByUser = gql`
  query GetPostsCountByUser($user: String) @api(name: butter) {
    createdPosts: post_aggregate(where: { author_address: { _eq: $user } }) {
      aggregate {
        count
      }
    }

    likedPosts: post_likes_aggregate(where: { user_address: { _eq: $user } }) {
      aggregate {
        count
      }
    }
  }
`;

export default GetPostsCountByUser;
