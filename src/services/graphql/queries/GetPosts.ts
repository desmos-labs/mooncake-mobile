import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const GetPosts = gql`
  ${PostFields}
  query GetPosts($offset: Int, $limit: Int) @api(name: butter) {
    posts: post(
      offset: $offset
      limit: $limit
      order_by: { creation_date: desc }
      where: { _not: { conversation: {} }, external_id: { _is_null: false } }
    ) {
      ...PostFields
    }
  }
`;

export default GetPosts;
