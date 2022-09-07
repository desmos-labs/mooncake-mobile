import {gql} from '@apollo/client';

const GetPostsForAddress = gql`
  query LikedUserPosts($subspaceID: bigint!, $address: String!, $spec: jsonb)
  @api(name: desmos) {
    reaction(
      where: {
        post: {subspace_id: {_eq: $subspaceID}}
        author_address: {_eq: $address}
        value: {_contains: $spec}
      }
    ) {
      post {
        ...PostFields
      }
    }
  }
`;

export default GetPostsForAddress;
