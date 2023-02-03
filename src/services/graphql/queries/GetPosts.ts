import { gql } from '@apollo/client';
import POST_FIELDS from 'services/graphql/queries/fragments/PostFields';

const GetPosts = gql`
  ${POST_FIELDS}
  query GetPostsBetweenDates(
    $offset: Int
    $limit: Int
    $subspaceID: bigint
    $user: String
    $reaction: jsonb!
  ) @api(name: butter) {
    posts: post(
      offset: $offset
      limit: $limit
      order_by: { creation_date: desc }
      where: { subspace_id: { _eq: $subspaceID }, _not: { conversation: {} } }
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

export default GetPosts;
