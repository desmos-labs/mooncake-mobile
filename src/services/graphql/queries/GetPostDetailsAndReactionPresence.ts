import {gql} from '@apollo/client';
import {POST_FIELDS} from 'services/graphql/queries/GetPosts';

const GetPostDetailsAndReactionPresence = gql`
  ${POST_FIELDS}
  query PostDetailsAndReactionPresence(
    $subspaceID: bigint!
    $postID: bigint!
    $user: String
    $reaction: jsonb!
  ) @api(name: desmos) {
    posts: post(where: {subspace_id: {_eq: $subspaceID}, id: {_eq: $postID}}) {
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
    }
  }
`;

export default GetPostDetailsAndReactionPresence;
