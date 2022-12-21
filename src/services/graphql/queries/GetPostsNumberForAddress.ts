import {gql} from '@apollo/client';

const GetPostsNumberForAddress = gql`
  query GetPostsNumberForAddress($subspaceID: bigint!, $address: String)
  @api(name: butter) {
    post(
      order_by: {creation_date: desc}
      where: {
        author_address: {_eq: $address}
        subspace_id: {_eq: $subspaceID}
        _not: {conversation: {}}
      }
    ) {
      id
    }
  }
`;

export default GetPostsNumberForAddress;
