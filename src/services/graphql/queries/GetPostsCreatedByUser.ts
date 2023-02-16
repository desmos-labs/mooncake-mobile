import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const GetPostsCreatedByUser = gql`
  ${PostFields}
  query GetPostsCreatedByUser($subspaceId: bigint!, $user: String, $offset: Int!, $limit: Int!)
  @api(name: butter) {
    posts: post(
      order_by: { creation_date: desc }
      where: { author_address: { _eq: $user }, subspace_id: { _eq: $subspaceId } }
      limit: $limit
      offset: $offset
    ) {
      ...PostFields
    }
  }
`;

export default GetPostsCreatedByUser;
