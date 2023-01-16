import {gql} from '@apollo/client';
import POST_FIELDS from 'services/graphql/queries/fragments/PostFields';

const GetPostsLikedForAddress = gql`
  ${POST_FIELDS}
  query LikedUserPosts($subspaceID: bigint, $address: String)
  @api(name: butter) {
    reaction(
      where: {
        post: {subspace_id: {_eq: $subspaceID}}
        author_address: {_eq: $address}
      }
    ) {
      post {
        ...PostFields
      }
    }
  }
`;

export default GetPostsLikedForAddress;
