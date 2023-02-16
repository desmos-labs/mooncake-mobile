import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const GetPostComments = gql`
  ${PostFields}
  query GetPostComments(
    $subspaceId: bigint
    $postId: bigint
    $user: String
    $reaction: jsonb!
    $offset: Int
    $limit: Int
  ) @api(name: butter) {
    comments: post(
      order_by: { creation_date: asc }
      where: {
        subspace_id: { _eq: $subspaceId }
        conversation: { id: { _eq: $postId } }
        references: {
          type: { _eq: "POST_REFERENCE_TYPE_REPLY" }
          reference: { id: { _eq: $postId } }
        }
      }
      offset: $offset
      limit: $limit
    ) {
      ...PostFields
      reactionPresence: reactions_aggregate(
        where: { author_address: { _eq: $user }, value: { _contains: $reaction } }
      ) {
        aggregate {
          count
        }
      }
    }
  }
`;

export default GetPostComments;
