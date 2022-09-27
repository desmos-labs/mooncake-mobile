import {gql} from '@apollo/client';

export const GetPostReactions = gql`
  query PostReactions($subspaceID: bigint!, $postID: bigint!)
  @api(name: desmos) {
    reaction(
      where: {post: {subspace_id: {_eq: $subspaceID}, id: {_eq: $postID}}}
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

export const GetReactionForPostAndAuthor = gql`
  query PostReactionsCount(
    $subspaceID: bigint!
    $postID: bigint!
    $address: String
  ) @api(name: desmos) {
    reaction(
      where: {
        post: {subspace_id: {_eq: $subspaceID}, id: {_eq: $postID}}
        author_address: {_eq: $address}
      }
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
