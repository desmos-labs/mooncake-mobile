import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const GetPostsFromFollowing = gql`
  ${PostFields}
  query GetPostsFromFollowing(
    $subspaceId: bigint
    $following: [String!]
    $user: String
    $reaction: jsonb!
    $offset: Int
    $limit: Int
  ) @api(name: butter) {
    posts: post(
      offset: $offset
      limit: $limit
      order_by: { creation_date: desc }
      where: {
        subspace_id: { _eq: $subspaceId }
        _not: { conversation: {} }
        author_address: { _in: $following }
        external_id: { _is_null: false }
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

export default GetPostsFromFollowing;
