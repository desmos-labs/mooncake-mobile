import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const SearchPosts = gql`
  ${PostFields}
  query SearchPosts($search: String, $offset: Int!, $limit: Int!) @api(name: butter) {
    posts: post(
      where: {
        text: { _ilike: $search }
        _not: { conversation: {} }
        external_id: { _is_null: false }
      }
      offset: $offset
      limit: $limit
    ) {
      ...PostFields
    }
  }
`;

export default SearchPosts;
