import {gql} from '@apollo/client';

/**
 * Subscribe to the number of replies of a given comment
 */
const CommentRepliesAggregateSubscriptions = gql`
  subscription CommentRepliesAggregateSubscriptions(
    $commentID: bigint
    $subspaceID: bigint
  ) @api(name: butter) {
    post_aggregate(
      where: {
        subspace_id: {_eq: $subspaceID}
        references: {
          type: {_eq: "POST_REFERENCE_TYPE_REPLY"}
          reference: {id: {_eq: $commentID}}
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
