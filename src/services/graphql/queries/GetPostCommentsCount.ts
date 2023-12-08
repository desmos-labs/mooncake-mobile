import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const GetPostCommentsCount = gql`
  ${PostFields}
  query GetPostCommentsCount($postId: bigint!) @api(name: butter) {
    comments: post_aggregate(
      where: {
        references: {
          type: { _eq: "POST_REFERENCE_TYPE_REPLY" }
          reference: { id: { _eq: $postId } }
        }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export default GetPostCommentsCount;
