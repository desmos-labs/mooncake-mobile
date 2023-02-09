import { gql } from '@apollo/client';
import POST_FIELDS from 'services/graphql/queries/fragments/PostFields';

const GetPostCommentsCount = gql`
  ${POST_FIELDS}
  query PostCommentsCount($subspaceId: bigint!, $postId: bigint!) @api(name: butter) {
    comments: post_aggregate(
      where: {
        post: { subspace_id: { _eq: $subspaceID }, external_id: { _eq: $commentExternalId } }
        conversation: { id: { _eq: $postID } }
        references: {
          type: { _eq: "POST_REFERENCE_TYPE_REPLY" }
          reference: { id: { _eq: $postID } }
        }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export default GetPostCommentsCount;
