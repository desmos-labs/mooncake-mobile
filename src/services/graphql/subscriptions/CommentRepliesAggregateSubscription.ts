import { gql } from '@apollo/client';

/**
 * Subscribe to the number of replies of a given comment
 */
const CommentRepliesAggregateSubscriptions = gql`
  subscription CommentRepliesAggregateSubscriptions($commentID: bigint, $subspaceId: bigint)
  @api(name: butter) {
    post_aggregate(
      where: {
        subspace_id: { _eq: $subspaceId }
        references: {
          type: { _eq: "POST_REFERENCE_TYPE_REPLY" }
          reference: { id: { _eq: $commentID } }
        }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export default CommentRepliesAggregateSubscriptions;
