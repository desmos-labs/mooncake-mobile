import { gql } from '@apollo/client';
import FollowingUsersPostFields from 'services/graphql/queries/fragments/FollowingUsersPostFields';

const GetFollowingUsersPosts = gql`
  ${FollowingUsersPostFields}
  query GetFollowingUsersPosts($offset: Int, $limit: Int) @api(name: butter) {
    posts: following_users_posts(
      offset: $offset
      limit: $limit
      order_by: { creation_date: desc }
      where: { _not: { conversation: {} }, external_id: { _is_null: false } }
    ) {
      ...FollowingUsersPostsFields
    }
  }
`;

export default GetFollowingUsersPosts;
