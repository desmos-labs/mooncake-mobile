import {gql} from '@apollo/client';
import {POST_FIELDS} from 'services/graphql/queries/GetPosts';

export const GetPostComments = gql`
  ${POST_FIELDS}
  query PostComments(
    $postID: bigint
    $subspaceID: bigint
    $limit: Int
    $offset: Int
  ) @api(name: desmos) {
    post(
      where: {
        subspace_id: {_eq: $subspaceID}
        conversation: {id: {_eq: $postID}}
        references: {type: {_eq: "POST_REFERENCE_TYPE_QUOTE"}}
      }
      limit: $limit
      offset: $offset
    ) {
      ...PostFields
    }
  }
`;

export const GetPostCommentsCount = gql`
  query PostCommentsCount($subspaceID: bigint!, $postID: bigint!)
  @api(name: desmos) {
    post_aggregate(
      where: {
        subspace_id: {_eq: $subspaceID}
        conversation: {id: {_eq: $postID}}
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;
