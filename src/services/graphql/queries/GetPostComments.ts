import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const GetPostComments = gql`
  ${PostFields}
  query GetPostComments($postId: bigint, $offset: Int, $limit: Int) @api(name: butter) {
    comments: post(
      order_by: { creation_date: asc }
      where: {
        references: {
          type: { _eq: "POST_REFERENCE_TYPE_REPLY" }
          reference: { id: { _eq: $postId } }
        }
      }
      offset: $offset
      limit: $limit
    ) {
      ...PostFields
    }
  }
`;

export default GetPostComments;
