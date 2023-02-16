import { gql } from '@apollo/client';
import NotificationReadFields from 'services/graphql/queries/fragments/NotificationReadFields';

const GetNotifications = gql`
  ${NotificationReadFields}
  query GetNotifications($limit: Int!, $offset: Int!) @api(name: butter) {
    notifications: notification(
      where: { _not: { data: { _contains: { type: "transaction_success" } } } }
      order_by: { timestamp: desc }
      limit: $limit
      offset: $offset
    ) {
      id
      user_address
      data
      timestamp
      type
      ...NotificationReadFields
    }
  }
`;

export default GetNotifications;
