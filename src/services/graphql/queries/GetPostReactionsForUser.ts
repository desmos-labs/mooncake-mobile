import { gql } from '@apollo/client';
import ReactionFields from 'services/graphql/queries/fragments/ReactionFields';

const GetPostReactionsForUser = gql`
  ${ReactionFields}
  query GetPostReactionsForUser($subspaceId: bigint!, $postId: bigint!, $userAddress: String!)
  @api(name: butter) {
    reactions: reaction(
      where: {
        post: { subspace_id: { _eq: $subspaceId }, id: { _eq: $postId } }
        author_address: { _eq: $userAddress }
      }
    ) {
      ...ReactionFields
    }
  }
`;

export default GetPostReactionsForUser;
