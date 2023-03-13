import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const GetPostsTippedByUser = gql`
  ${PostFields}
  query GetPostsTippedByUser($subspaceId: bigint!, $user: String, $offset: Int!, $limit: Int!)
  @api(name: butter) {
    tips: tip_post(
      where: { subspace_id: { _eq: $subspaceId }, sender_address: { _eq: $user } }
      offset: $offset
      limit: $limit
    ) {
      post {
        ...PostFields
      }
    }
  }
`;

export default GetPostsTippedByUser;
