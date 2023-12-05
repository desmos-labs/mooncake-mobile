import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const GetPostsFromFollowing = gql`
  ${PostFields}
  query GetPostsFromFollowing($following: [String!], $offset: Int, $limit: Int) @api(name: butter) {
    posts: post(
      offset: $offset
      limit: $limit
      order_by: { creation_date: desc }
      where: {
        _not: { conversation: {} }
        author_address: { _in: $following }
        external_id: { _is_null: false }
      }
    ) {
      ...PostFields
    }
  }
`;

export default GetPostsFromFollowing;
