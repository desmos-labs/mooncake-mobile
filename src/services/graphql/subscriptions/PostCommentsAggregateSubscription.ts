import {gql} from '@apollo/client';

/**
 * Subscribe to the number of comments of a given postID
 */
const PostCommentsAggregateSubscription = gql`
  subscription UserPostAggregateSubscription(
    $subspaceID: bigint!
    $postID: bigint!
  ) @api(name: butter) {
    post_aggregate(
      where: {
        subspace_id: {_eq: $subspaceID}
        conversation: {id: {_eq: $postID}}
        references: {
          type: {_eq: "POST_REFERENCE_TYPE_REPLY"}
          reference: {id: {_eq: $postID}}
        }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export default PostCommentsAggregateSubscription;
