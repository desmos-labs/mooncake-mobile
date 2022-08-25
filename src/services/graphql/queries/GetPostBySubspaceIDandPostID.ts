import {gql} from '@apollo/client';
import {POST_FIELDS} from 'services/graphql/queries/GetPosts';

const GetPostBySubspaceIDandPostID = gql`
  ${POST_FIELDS}
  query GetPostBySubspaceIDandPostID($ID: bigint, $subspaceID: bigint)
  @api(name: desmos) {
    posts: post(where: {subspace_id: {_eq: $subspaceID}, id: {_eq: $ID}}) {
      ...PostFields
    }
  }
`;

export default GetPostBySubspaceIDandPostID;
