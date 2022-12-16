import {gql} from '@apollo/client';

const GetPostsForAddressWithLimit = gql`
  query GetPostsForAddress($subspaceID: bigint!, $address: String, $limit: Int!)
  @api(name: butter) {
    post(
      order_by: {creation_date: desc}
      where: {
        author_address: {_eq: $address}
        subspace_id: {_eq: $subspaceID}
        _not: {conversation: {}}
      }
      limit: $limit
    ) {
      id
      creation_date
      author_address
      attachments {
        id
        content
      }
      author {
        address
        bio
        dtag
        profile_pic
        nickname
      }
      subspace_id
      reactions {
        id
        value
      }
      reactions_aggregate {
        aggregate {
          count
        }
      }
      text
      conversation {
        author {
          address
        }
      }
    }
  }
`;

export default GetPostsForAddressWithLimit;
