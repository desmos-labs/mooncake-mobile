import { gql } from '@apollo/client';

const GetPostTipsCount = gql`
  query GetPostTipsCount($subspaceId: bigint, $postId: bigint) @api(name: butter) {
    tips: tip_post_aggregate(
      where: { post: { subspace_id: { _eq: $subspaceId }, id: { _eq: $postID } } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export default GetPostTipsCount;
