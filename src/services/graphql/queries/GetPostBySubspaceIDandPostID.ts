import {gql} from '@apollo/client';

const GetPostBySubspaceIDandPostID = gql`
  query GetPostBySubspaceIDandPostID($ID: bigint, $subspaceID: bigint)
  @api(name: desmos) {
    posts: post(where: {subspace_id: {_eq: $subspaceID}, id: {_eq: $ID}}) {
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

export default GetPostBySubspaceIDandPostID;
