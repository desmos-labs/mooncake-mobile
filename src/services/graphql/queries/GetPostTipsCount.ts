import { gql } from '@apollo/client';

const GetPostTipsCount = gql`
  query PostTipsCount($subspaceId: bigint, $postId: bigint) @api(name: butter) {
    tips: tip_post_aggregate(
      where: { post: { subspace_id: { _eq: $subspaceID }, id: { _eq: $postID } } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export default GetPostTipsCount;
