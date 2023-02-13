import { gql } from '@apollo/client';
import ProfileFields from 'services/graphql/queries/fragments/ProfilesFields';

const GetPostReaction = gql`
  ${ProfileFields}
  query Reaction($subspaceId: bigint!, $postId: bigint!, $offset: int, $limit: int)
  @api(name: butter) {
    reactions: reaction(
      where: { post: { subspace_id: { _eq: $subspaceId }, id: { _eq: $postId } } }
      offset: $offset
      limit: $limit
    ) {
      id
      post {
        subspace_id
        id
      }
      value
      author {
        ...ProfileFields
      }
    }
  }
`;

export default GetPostReaction;
