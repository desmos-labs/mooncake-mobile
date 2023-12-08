import { gql } from '@apollo/client';
import ProfileFields from 'services/graphql/queries/fragments/ProfilesFields';

const GetPostReactions = gql`
  ${ProfileFields}
  query GetPostReactions($postId: bigint!, $offset: Int, $limit: Int) @api(name: butter) {
    reactions: post_likes(
      where: { post: { id: { _eq: $postId } } }
      offset: $offset
      limit: $limit
    ) {
      author: liker {
        ...ProfileFields
      }
    }
  }
`;

export default GetPostReactions;
