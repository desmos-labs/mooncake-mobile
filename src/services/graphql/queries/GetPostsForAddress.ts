import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const GetPostsForAddress = gql`
  ${PostFields}
  query GetPostsForAddress($subspaceID: bigint!, $address: String) @api(name: butter) {
    post(
      order_by: { creation_date: desc }
      where: {
        author_address: { _eq: $address }
        subspace_id: { _eq: $subspaceID }
        _not: { conversation: {} }
      }
    ) {
      ...PostFields
    }
  }
`;

export default GetPostsForAddress;
