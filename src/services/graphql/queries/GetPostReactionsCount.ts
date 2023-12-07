import { gql } from '@apollo/client';

const GetPostReactionsCount = gql`
  query GetPostReactionsCount($postId: bigint!) @api(name: butter) {
    reactions: post_likes_aggregate(where: { post_id: { _eq: $postId } }) {
      aggregate {
        count
      }
    }
  }
`;

export default GetPostReactionsCount;
