import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const GetPostsLikedByUser = gql`
  ${PostFields}
  query GetPostsLikedByUser($user: String, $offset: Int!, $limit: Int!) @api(name: butter) {
    posts: post_likes(
      where: { user_address: { _eq: $user } }
      order_by: { post: { id: desc } }
      offset: $offset
      limit: $limit
    ) {
      post {
        ...PostFields
      }
    }
  }
`;

export default GetPostsLikedByUser;
