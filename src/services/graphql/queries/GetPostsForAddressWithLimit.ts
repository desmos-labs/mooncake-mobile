import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const GetPostsForAddressWithLimit = gql`
  ${PostFields}
  query GetPostsForAddress($subspaceID: bigint!, $address: String, $limit: Int!)
  @api(name: butter) {
    post(
      order_by: { creation_date: desc }
      where: {
        author_address: { _eq: $address }
        subspace_id: { _eq: $subspaceID }
        _not: { conversation: {} }
      }
      limit: $limit
    ) {
      ...PostFields
    }
  }
`;

export default GetPostsForAddressWithLimit;
