import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const GetPostsCreatedByUser = gql`
  ${PostFields}
  query GetPostsCreatedByUser($user: String, $offset: Int!, $limit: Int!) @api(name: butter) {
    posts: post(
      where: { author_address: { _eq: $user }, _not: { conversation: {} } }
      order_by: { creation_date: desc }
      offset: $offset
      limit: $limit
    ) {
      ...PostFields
    }
  }
`;

export default GetPostsCreatedByUser;
