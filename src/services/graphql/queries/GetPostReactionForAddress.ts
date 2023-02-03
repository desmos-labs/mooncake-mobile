import { gql } from '@apollo/client';

const GetPostReactionForAddress = gql`
  query Reaction($subspaceId: bigint!, $postId: bigint!, $userAddress: String!) @api(name: butter) {
    reactions: reaction(
      where: {
        post: { subspace_id: { _eq: $subspaceId }, id: { _eq: $postId } }
        author_address: { _eq: $userAddress }
      }
    ) {
      id
      value
    }
  }
`;

export default GetPostReactionForAddress;
