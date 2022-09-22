import {gql} from '@apollo/client';
import {POST_FIELDS} from 'services/graphql/queries/GetPosts';

export const GetPostComments = gql`
  ${POST_FIELDS}
  query PostComments($postID: bigint, $subspaceID: bigint) @api(name: desmos) {
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
    }
  }
`;

export const GetCommentReplies = gql`
  query PostComments($postID: bigint, $subspaceID: bigint) @api(name: desmos) {
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
        reactions_aggregate {
          aggregate {
            count
          }
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
      }
    }
  }
`;
