import { gql } from '@apollo/client';

const GetPostReactionsCount = gql`
  query Reaction($postID: bigint!) {
    reactions: reaction_aggregate(where: { post: { id: { _eq: $postID } } }) {
      aggregate {
        count
      }
    }
  }
`;

export default GetPostReactionsCount;
