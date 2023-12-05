import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const GetPostByID = gql`
  ${PostFields}
  query GetPost($postId: bigint!) @api(name: butter) {
    posts: post(where: { id: { _eq: $postId } }) {
      ...PostFields
    }
  }
`;

export default GetPostByID;
