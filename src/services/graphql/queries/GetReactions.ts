import {gql} from '@apollo/client';

const GetPostReactions = gql`
  query PostReactions(
    $subspaceID: bigint!
    $postID: bigint!
    $limit: Int!
    $offset: Int!
  ) @api(name: desmos) {
    reaction(
      where: {post: {subspace_id: {_eq: $subspaceID}, id: {_eq: $postID}}}
      limit: $limit
      offset: $offset
    ) {
      id
      value
      author {
        address
        dtag
        profile_pic
        nickname
      }
    }
  }
`;

export default GetPostReactions;
