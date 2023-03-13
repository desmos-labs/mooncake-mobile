import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const GetPostsLikedByUser = gql`
  ${PostFields}
  query GetPostsLikedByUser($subspaceId: bigint!, $user: String, $offset: Int!, $limit: Int!)
  @api(name: butter) {
    reactions: reaction(
      where: { author_address: { _eq: $user }, post: { subspace_id: { _eq: $subspaceId } } }
      order_by: { post: { id: desc } }
      offset: $offset
      limit: $limit
    ) {
      post {
        ...PostFields
      }
    }
  }
`;

export default GetPostsLikedByUser;
