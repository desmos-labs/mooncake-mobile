import { gql } from '@apollo/client';
import ReactionFields from 'services/graphql/queries/fragments/ReactionFields';

const GetPostReactions = gql`
  ${ReactionFields}
  query GetPostReactions($subspaceId: bigint!, $postId: bigint!, $offset: Int, $limit: Int)
  @api(name: butter) {
    reactions: reaction(
      where: { post: { subspace_id: { _eq: $subspaceId }, id: { _eq: $postId } } }
      offset: $offset
      limit: $limit
    ) {
      ...ReactionFields
    }
  }
`;

export default GetPostReactions;
