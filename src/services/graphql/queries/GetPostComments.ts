import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const GetPostComments = gql`
  ${PostFields}
  query PostComments(
    $subspaceID: bigint
    $postID: bigint
    $user: String
    $reaction: jsonb!
    $offset: int
    $limit: int
  ) @api(name: butter) {
    posts: post(
      order_by: { creation_date: asc }
      where: {
        subspace_id: { _eq: $subspaceID }
        conversation: { id: { _eq: $postID } }
        references: {
          type: { _eq: "POST_REFERENCE_TYPE_REPLY" }
          reference: { id: { _eq: $postID } }
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
