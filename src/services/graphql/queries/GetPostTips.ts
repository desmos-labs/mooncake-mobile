import {gql} from '@apollo/client';

const GetPostTips = gql`
  query PostTips($postID: bigint, $subspaceID: bigint) @api(name: desmos) {
    tip_post(
      where: {post: {subspace_id: {_eq: $subspaceID}, id: {_eq: $postID}}}
    ) {
      sender {
        address
        bio
        dtag
        creation_time
        cover_pic
        nickname
        profile_pic
      }
      post {
        id
        creation_date
        author_address
      }
      amount
    }
  }
`;

export default GetPostTips;
