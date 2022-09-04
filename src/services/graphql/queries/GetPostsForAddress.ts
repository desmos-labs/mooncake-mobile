import {gql} from '@apollo/client';

const GetPostsForAddress = gql`
  query GetPostsForAddress($address: String) @api(name: desmos) {
    post(
      order_by: {creation_date: desc}
      where: {author_address: {_eq: $address}}
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
      text
      conversation {
        author {
          address
        }
      }
    }
  }
`;

export default GetPostsForAddress;
