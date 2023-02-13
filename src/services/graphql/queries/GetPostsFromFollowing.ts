import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const GetPostsFromFollowing = gql`
  ${PostFields}
  query GetPostsBetweenDates(
    $offset: Int
    $limit: Int
    $subspaceID: bigint
    $following: [String!]
    $user: String
    $reaction: jsonb!
  ) @api(name: butter) {
    posts: post(
      offset: $offset
      limit: $limit
      order_by: { creation_date: desc }
      where: {
        subspace_id: { _eq: $subspaceID }
        _not: { conversation: {} }
        author_address: { _in: $following }
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
