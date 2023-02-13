import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const GetPost = gql`
  ${PostFields}
  query GetPost(
    $subspaceID: bigint!
    $postID: bigint!
    $user: String
    $reaction: jsonb!
    $offset: int
    $limit: limit
  ) @api(name: butter) {
    posts: post(
      where: { subspace_id: { _eq: $subspaceID }, id: { _eq: $postID } }
      offset: $offset
      limit: $limit
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

export default GetPost;
