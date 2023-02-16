import { gql } from '@apollo/client';

const GetPostsCountByUser = gql`
  query GetPostsCountByUser($subspaceId: bigint!, $user: String) @api(name: butter) {
    createdPosts: post_aggregate(
      where: { subspace_id: { _eq: $subspaceId }, author_address: { _eq: $user } }
    ) {
      aggregate {
        count
      }
    }

    likedPosts: reaction_aggregate(
      where: { post: { subspace_id: { _eq: $subspaceId } }, author_address: { _eq: $user } }
    ) {
      aggregate {
        count
      }
    }

    tippedPosts: tip_post_aggregate(
      where: { subspace_id: { _eq: $subspaceId }, sender_address: { _eq: $user } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export default GetPostsCountByUser;
