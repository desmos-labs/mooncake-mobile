import {gql} from '@apollo/client';

const GetPosts = gql`
  query GetPostsBetweenDates($offset: Int, $limit: Int) @api(name: desmos) {
    post(offset: $offset, limit: $limit) {
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

export default GetPosts;
