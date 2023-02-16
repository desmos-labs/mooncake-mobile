import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const GetCommentReplies = gql`
  ${PostFields}
  query GetCommentReplies($postID: bigint, $subspaceId: bigint, $user: String, $reaction: jsonb!)
  @api(name: butter) {
    post_reference(
      where: { reference: { subspace_id: { _eq: $subspaceId }, id: { _eq: $postID } } }
    ) {
      reference {
        id
      }
      post {
        ...PostFields
        repliesCount: referees_aggregate(where: { type: { _eq: "POST_REFERENCE_TYPE_REPLY" } }) {
          aggregate {
            count
          }
        }
        reactionPresence: reactions_aggregate(
          where: { author_address: { _eq: $user }, value: { _contains: $reaction } }
        ) {
          aggregate {
            count
          }
        }
      }
    }
  }
`;

export default GetCommentReplies;
