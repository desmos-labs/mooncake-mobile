import { gql } from '@apollo/client';
import POST_FIELDS from 'services/graphql/queries/fragments/PostFields';

const GetPostsFromFollowing = gql`
  ${POST_FIELDS}
  query GetPostsBetweenDates(
    $offset: Int
    $limit: Int
    $subspaceID: bigint
    $following: [String!]
    $user: String
    $reaction: jsonb!
  ) @api(name: butter) {
    post(
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
      tipPresence: tips_aggregate(where: { sender_address: { _eq: $user } }) {
        aggregate {
          count
        }
      }
      commentPresence: comments_aggregate(where: { author_address: { _eq: $user } }) {
        aggregate {
          count
        }
      }
    }
  }
`;

export default GetPostsFromFollowing;
