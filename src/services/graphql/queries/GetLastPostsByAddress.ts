import {gql} from '@apollo/client';
import {POST_FIELDS} from 'services/graphql/queries/GetPosts';

const GetLastPostsTxHashByAddress = gql`
  ${POST_FIELDS}
  query GetRecentPostsByAddress(
    $limit: Int
    $subspaceID: bigint
    $user: String
    $reaction: jsonb!
  ) @api(name: desmos) {
    post(
      limit: $limit
      order_by: {creation_date: desc}
      where: {subspace_id: {_eq: $subspaceID}, _not: {conversation: {}}}
    ) {
      ...PostFields
      reactionPresence: reactions_aggregate(
        where: {author_address: {_eq: $user}, value: {_contains: $reaction}}
      ) {
        aggregate {
          count
        }
      }
      tipPresence: tips_aggregate(where: {sender_address: {_eq: $user}}) {
        aggregate {
          count
        }
      }
      commentPresence: comments_aggregate(
        where: {author_address: {_eq: $user}}
      ) {
        aggregate {
          count
        }
      }
    }
  }
`;

export default GetLastPostsTxHashByAddress;
