import {gql} from '@apollo/client';

export const GetPostTips = gql`
  query PostTips($postID: bigint, $subspaceID: bigint) @api(name: butter) {
    tip_post(
      where: {post: {subspace_id: {_eq: $subspaceID}, id: {_eq: $postID}}}
    ) {
      sender {
        address
        dtag
        nickname
        profile_pic
      }
      post {
        id
      }
      amount
    }
  }
`;

export const GetTippedPostsFromAddress = gql`
  query TippedPosts($subspaceID: bigint!, $user: String!) @api(name: butter) {
    tip_post(
      where: {subspace_id: {_eq: $subspaceID}, sender_address: {_eq: $user}}
    ) {
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
      }
    }
  }
`;
