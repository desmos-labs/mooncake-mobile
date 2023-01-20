import {gql} from '@apollo/client';
import POST_FIELDS from 'services/graphql/queries/fragments/PostFields';

export const GetPostComments = gql`
  ${POST_FIELDS}
  query PostComments(
    $postID: bigint
    $subspaceID: bigint
    $user: String
    $reaction: jsonb!
  ) @api(name: butter) {
    post(
      order_by: {creation_date: asc}
      where: {
        subspace_id: {_eq: $subspaceID}
        conversation: {id: {_eq: $postID}}
        references: {
          type: {_eq: "POST_REFERENCE_TYPE_REPLY"}
          reference: {id: {_eq: $postID}}
        }
      }
    ) {
      ...PostFields
      reactionPresence: reactions_aggregate(
        where: {author_address: {_eq: $user}, value: {_contains: $reaction}}
      ) {
        aggregate {
          count
        }
      }
      tipPresence: tips_aggregate(where: {sender_address: {_eq: $user}}) {
        aggregate {
          count
        }
      }
      commentPresence: comments_aggregate(
        where: {author_address: {_eq: $user}}
      ) {
        aggregate {
          count
        }
      }
    }
  }
`;

export const GetCommentReplies = gql`
  ${POST_FIELDS}
  query PostComments(
    $postID: bigint
    $subspaceID: bigint
    $user: String
    $reaction: jsonb!
  ) @api(name: butter) {
    post_reference(
      where: {reference: {subspace_id: {_eq: $subspaceID}, id: {_eq: $postID}}}
    ) {
      reference {
        id
      }
      post {
        ...PostFields
        repliesCount: referees_aggregate(
          where: {type: {_eq: "POST_REFERENCE_TYPE_REPLY"}}
        ) {
          aggregate {
            count
          }
        }
        reactionPresence: reactions_aggregate(
          where: {author_address: {_eq: $user}, value: {_contains: $reaction}}
        ) {
          aggregate {
            count
          }
        }
      }
    }
  }
`;
