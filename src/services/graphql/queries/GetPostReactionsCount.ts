import { gql } from '@apollo/client';

const GetPostReactionsCount = gql`
  query GetPostReactionsCount($subspaceId: bigint!, $postId: bigint!) @api(name: butter) {
    reactions: reaction_aggregate(
      where: { post: { subspace_id: { _eq: $subspaceId }, id: { _eq: $postId } } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export default GetPostReactionsCount;
