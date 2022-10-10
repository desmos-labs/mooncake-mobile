import {gql} from '@apollo/client';
import {POST_FIELDS} from 'services/graphql/queries/GetPosts';

export const GetPostComments = gql`
  ${POST_FIELDS}
  query PostComments(
    $postID: bigint
    $subspaceID: bigint
    $user: String
    $reaction: jsonb!
  ) @api(name: desmos) {
    post(
      order_by: {creation_date: asc}
      where: {
        subspace_id: {_eq: $subspaceID}
        conversation: {id: {_eq: $postID}}
        references: {
          type: {
            _in: ["POST_REFERENCE_TYPE_QUOTE", "POST_REFERENCE_TYPE_REPLY"]
          }
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
    }
  }
`;

export const GetCommentReplies = gql`
  query PostComments(
    $postID: bigint
    $subspaceID: bigint
    $user: String
    $reaction: jsonb!
  ) @api(name: desmos) {
    post_reference(
      where: {reference: {subspace_id: {_eq: $subspaceID}, id: {_eq: $postID}}}
    ) {
      reference {
        id
      }
      post {
        id
        creation_date
        author_address
        attachments {
          id
          content
        }
        author {
          address
          bio
          dtag
          profile_pic
          nickname
        }
        subspace_id
        reactions {
          id
          value
        }
        text
        conversation {
          author {
            address
          }
        }
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
