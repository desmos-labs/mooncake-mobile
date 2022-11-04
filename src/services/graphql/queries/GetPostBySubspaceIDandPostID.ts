import {gql} from '@apollo/client';
import POST_FIELDS from './fragments/PostFields';

const GetPostBySubspaceIDandPostID = gql`
  ${POST_FIELDS}
  query GetPostBySubspaceIDandPostID($postID: bigint, $subspaceID: bigint)
  @api(name: desmos) {
    posts: post(where: {subspace_id: {_eq: $subspaceID}, id: {_eq: $postID}}) {
      ...PostFields
    }
  }
`;

export default GetPostBySubspaceIDandPostID;
