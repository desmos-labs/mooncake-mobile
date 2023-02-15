import { gql } from '@apollo/client';
import ReactionFields from 'services/graphql/queries/fragments/ReactionFields';

const GetPostReaction = gql`
  ${ReactionFields}
  query Reaction($subspaceId: bigint!, $postId: bigint!, $reactionId: Int!) @api(name: butter) {
    reactions: reaction(
      where: { post: { subspace_id: { _eq: $subspaceId }, id: { _eq: $postId } } }
      id: { _eq: $reactionId }
    ) {
      ...ReactionFields
    }
  }
`;

export default GetPostReaction;
