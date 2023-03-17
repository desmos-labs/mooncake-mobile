import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const GetPostByID = gql`
  ${PostFields}
  query GetPost($subspaceId: bigint!, $postId: bigint!, $user: String, $reaction: jsonb!)
  @api(name: butter) {
    posts: post(where: { subspace_id: { _eq: $subspaceId }, id: { _eq: $postId } }) {
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

export default GetPostByID;
