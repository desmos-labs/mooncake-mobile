import { gql } from '@apollo/client';

const GetPostReactionsCount = gql`
  query Reaction($subspaceId: bigint!, $postId: bigint!) @api(name: butter) {
    reactions: reaction_aggregate(
      where: { post: { subspace_id: { _eq: $subspaceId }, id: { _eq: $postID } } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export default GetPostReactionsCount;
