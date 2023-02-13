import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const GetPostReaction = gql`
  ${PostFields}
  query Reaction($subspaceId: bigint!, $postId: bigint!, $commentExternalId: String!)
  @api(name: butter) {
    comments: post(
      where: {
        post: { subspace_id: { _eq: $subspaceID }, external_id: { _eq: $commentExternalId } }
        conversation: { id: { _eq: $postID } }
        references: {
          type: { _eq: "POST_REFERENCE_TYPE_REPLY" }
          reference: { id: { _eq: $postID } }
        }
        author_address: { _eq: $userAddress }
      }
    ) {
      ...PostFields
      reactionPresence: reactions_aggregate(
        where: { author_address: { _eq: $user }, value: { _contains: $reaction } }
      ) {
        aggregate {
          count
        }
      }
    }
  }
`;

export default GetPostReaction;
