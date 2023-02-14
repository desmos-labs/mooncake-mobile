import ProfileFields from 'services/graphql/queries/fragments/ProfilesFields';
import { gql } from '@apollo/client';

const GetPostInteractionsAuthors = gql`
  ${ProfileFields}
  query GetPostInteractionsAuthors($subspaceId: bigint!, $postId: bigint!, $limit: Int!)
  @api(name: butter) {
    reactions: reaction(
      where: { post: { subspace_id: { _eq: $subspaceId }, id: { _eq: $postId } } }
      limit: $limit
    ) {
      author {
        ...ProfileFields
      }
    }
    tips: tip_post(
      where: { post: { subspace_id: { _eq: $subspaceId }, id: { _eq: $postId } } }
      limit: $limit
    ) {
      author: sender {
        ...ProfileFields
      }
    }
  }
`;

export default GetPostInteractionsAuthors;
