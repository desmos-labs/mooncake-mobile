import { gql } from '@apollo/client';
import POST_FIELDS from 'services/graphql/queries/fragments/PostFields';

const GetPost = gql`
  ${POST_FIELDS}
  query GetPost($subspaceID: bigint!, $postID: bigint!, $user: String, $reaction: jsonb!)
  @api(name: butter) {
    posts: post(where: { subspace_id: { _eq: $subspaceID }, id: { _eq: $postID } }) {
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

export default GetPost;
