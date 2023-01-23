import {gql} from '@apollo/client';

const GetReadNotifications = gql`
  query ReadUserNotifications($limit: Int!, $offset: Int!) @api(name: butter) {
    notification_read(limit: $limit, offset: $offset) {
      user_address
      notification_id
    }
  }
`;

export default GetReadNotifications;
