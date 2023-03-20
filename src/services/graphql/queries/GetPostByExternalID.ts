import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const GetPostByExternalID = gql`
  ${PostFields}
  query GetPost($subspaceId: bigint!, $externalId: String!, $user: String, $reaction: jsonb!)
  @api(name: butter) {
    posts: post(
      where: { subspace_id: { _eq: $subspaceId }, external_id: { _ilike: $externalId } }
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

export default GetPostByExternalID;
