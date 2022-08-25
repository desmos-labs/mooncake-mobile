import {gql} from '@apollo/client';

const GetPostReactions = gql`
  query PostReactions($subspaceID: bigint!, $postID: bigint!)
  @api(name: desmos) {
    reaction(
      where: {post: {subspace_id: {_eq: $subspaceID}, id: {_eq: $postID}}}
    ) {
      id
      value
      author {
        dtag
        nickname
        profile_pic
      }
    }
  }
`;

export default GetPostReactions;
