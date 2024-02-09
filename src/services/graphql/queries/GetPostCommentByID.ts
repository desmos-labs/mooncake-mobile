import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const GetPostCommentByID = gql`
  ${PostFields}
  query GetPost($commentId: bigint!) @api(name: butter) {
    comments: post(where: { id: { _eq: $commentId } }) {
      ...PostFields
    }
  }
`;

export default GetPostCommentByID;
