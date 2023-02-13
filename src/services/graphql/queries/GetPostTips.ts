import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

export const GetPostTips = gql`
  query PostTips($postID: bigint, $subspaceID: bigint) @api(name: butter) {
    tip_post(where: { post: { subspace_id: { _eq: $subspaceID }, id: { _eq: $postID } } }) {
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
  ${PostFields}
  query TippedPosts($subspaceID: bigint!, $user: String!) @api(name: butter) {
    tip_post(where: { subspace_id: { _eq: $subspaceID }, sender_address: { _eq: $user } }) {
      post {
        ...PostFields
      }
    }
  }
`;
